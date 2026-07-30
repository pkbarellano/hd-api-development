# HD API — Project Documentation

> A multi-role REST API backend built with Node.js, Express, and Microsoft SQL Server.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [How It Works — Plain English](#3-how-it-works--plain-english)
4. [Architecture Overview](#4-architecture-overview)
5. [User Roles](#5-user-roles)
6. [API Endpoints](#6-api-endpoints)
7. [Security Design](#7-security-design)
8. [Database Design](#8-database-design)
9. [Project Structure](#9-project-structure)
10. [Key Technical Decisions](#10-key-technical-decisions)

---

## 1. Project Overview

HD API is the backend service of a multi-panel web application that supports three distinct types of users — **Superusers**, **Regular Users**, and **Agents** — each with their own login flow, access permissions, and navigation menus.

The API handles everything from account creation and login to session management and role-based navigation. It is designed to serve a frontend client (running on `http://localhost:3000`) and enforces a custom two-layer security mechanism on every request.

**What this API enables:**
- Secure, role-aware login and logout
- Session creation, validation, and cleanup
- Searchable, paginated user listing
- Dynamic, permission-based navigation menus
- Self-service user registration

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime — powers the server |
| **Express.js** v4 | Web framework — handles routing and HTTP |
| **Sequelize** v6 | ORM — maps database tables to JavaScript objects |
| **Microsoft SQL Server** | Database (via the `tedious` driver) |
| **bcrypt** | Secure password hashing and comparison |
| **UUID v1** | Generates unique session keys |
| **crypto (HMAC-SHA256)** | Request payload signature verification |
| **express-validator** | Input validation on all request bodies |
| **helmet** | Sets HTTP security headers |
| **morgan** | HTTP request logging |
| **cors** | Restricts API access to the designated frontend origin |
| **sequelize-cli** | Database migration and seeding tooling |

---

## 3. How It Works — Plain English

Think of this API as the secure back-office staff of the application. Here's what happens when someone uses the system:

### Signing Up
A new user submits their name, email, username, password, and department. The API checks that the username isn't already taken, hashes the password so it's never stored in plain text, and saves the account — automatically assigning them to the default permission group for their department.

### Logging In
When a user logs in, the API:
1. Confirms that their username and password match a real account
2. Checks they belong to the correct department
3. Cleans up any expired sessions for that user
4. Creates a fresh **session key** — a unique token that acts like a temporary pass
5. Returns the session key plus their profile information to the frontend

The frontend stores this session key and sends it with every future request to prove the user is still logged in.

### Session Checking
Before accessing any protected resource (like the user list), the API validates the session key. If it's expired or invalid, the request is rejected and the user must log in again.

### Navigation Menus
Each user's sidebar menu is not hardcoded — it's dynamically fetched from the database based on their permission group. This means an admin can have a different set of menu items than a standard user without any code changes.

### Logging Out
The API destroys the session record from the database, which immediately invalidates the session key.

---

## 4. Architecture Overview

```
Request from Frontend
        │
        ▼
┌─────────────────────────────────┐
│         Payload Middleware       │  ← Validates X-HD-Key header and
│  (API Key + HMAC Signature check)│    HMAC-SHA256 body signature
└────────────────┬────────────────┘
                 │
        ▼
┌─────────────────────────────────┐
│       Request Validators         │  ← express-validator rules
│  (field types, lengths, formats) │    per route (requests/ folder)
└────────────────┬────────────────┘
                 │
        ▼
┌─────────────────────────────────┐
│      Session Middleware          │  ← On protected routes only:
│   (validateSession)              │    verifies active session key
└────────────────┬────────────────┘
                 │
        ▼
┌─────────────────────────────────┐
│          Controllers             │  ← Business logic lives here
│  auth / session / user /         │
│  signup / navigation / defaults  │
└────────────────┬────────────────┘
                 │
        ▼
┌─────────────────────────────────┐
│      Sequelize ORM + Raw SQL     │  ← Database queries
│      Microsoft SQL Server        │    (ORM for relations, raw SQL
└─────────────────────────────────┘     for complex search/pagination)
```

Every single request — before it reaches a controller — must pass both the **API key check** and the **body signature check**. This is a custom double-authentication layer sitting above all routes.

---

## 5. User Roles

The system supports three roles, identified by a numeric `clientType`:

| clientType | Role | Description |
|---|---|---|
| `0` | **Superuser** | An agent with elevated privileges. Not tied to a specific department. |
| `1` | **User** | A standard end-user scoped to one department. |
| `2` | **Agent** | A support/operational staff member scoped to one department and optionally a team. |

Each role has slightly different data: Agents can belong to Teams; Users cannot. Superusers bypass department-level filtering in some queries.

---

## 6. API Endpoints

All endpoints accept `POST` requests with a JSON body. All requests require:
- `X-HD-Key` header — API access key
- `X-HD-Sign` header — HMAC-SHA256 signature of the request body

---

### Authentication — `/auth`

#### `POST /auth/read` — Login
Authenticates a user/agent/superuser and returns a session key.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword",
  "department": 1,
  "clientType": 1
}
```

**Success Response:**
```json
{
  "status": true,
  "data": {
    "sessionKey": "uuid-v1-token",
    "firstName": "John",
    "middleName": "A",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "department": 1,
    "departmentName": "Operations",
    "team": 0,
    "teamName": null,
    "group": 2,
    "groupName": "Standard Users",
    "clientType": 1,
    "clientTypeName": "user"
  }
}
```

**Failure Response (wrong credentials):**
```json
{
  "status": false,
  "message": "Your username is incorrect."
}
```

---

#### `POST /auth/destroy` — Logout
Invalidates and removes the active session.

**Request Body:**
```json
{
  "sessionKey": "uuid-v1-token",
  "clientType": 1,
  "department": 1
}
```

**Success Response:**
```json
{
  "status": true,
  "message": "Your session was successfully terminated."
}
```

---

### Session — `/session`

#### `POST /session/read` — Check Session
Validates an existing session key and returns the current user's profile. Used by the frontend on page reload to restore login state.

**Request Body:**
```json
{
  "sessionKey": "uuid-v1-token",
  "clientType": 1,
  "department": 1
}
```

**Success Response:** Same structure as login success response.

**Expired/Invalid Session Response:**
```json
{
  "status": false,
  "message": "Your session has ended."
}
```

---

### Signup — `/signup`

#### `POST /signup/create` — Register New User
Creates a new user account (clientType 1 only). Automatically assigns the user to the default permission group for their department.

**Request Body:**
```json
{
  "firstName": "Jane",
  "middleName": "B",
  "lastName": "Smith",
  "email": "jane@example.com",
  "username": "jane_smith",
  "password": "securepassword",
  "department": 1
}
```

**Success Response:**
```json
{
  "status": true,
  "message": "You are successfully registered."
}
```

**Duplicate Username Response:**
```json
{
  "status": false,
  "message": "The chosen username is already in use."
}
```

---

### User Management — `/user`

#### `POST /user/read` — List Users (Protected)
Returns a paginated, searchable list of users. Requires a valid session. Only accessible to Superusers (`clientType: 0`) and Users (`clientType: 1`).

**Request Body:**
```json
{
  "sessionKey": "uuid-v1-token",
  "clientType": 0,
  "department": 1,
  "search": "",
  "page": 0,
  "rowsPerPage": 10
}
```

**Success Response:**
```json
{
  "count": 42,
  "data": [
    {
      "id": 1,
      "firstName": "Jane",
      "middleName": "B",
      "lastName": "Smith",
      "username": "jane_smith",
      "email": "jane@example.com",
      "department": "Operations",
      "group": "Standard Users",
      "status": "Active",
      "createdAt": "2024-06-01 09:00",
      "updatedAt": "2024-06-10 14:30",
      "deletedAt": null
    }
  ]
}
```

> The `search` field filters across name, username, email, department, group name, status, and timestamps simultaneously.

---

### Navigation — `/navigation`

#### `POST /navigation/user` — Get User Navigation Menu
Returns the 3-level navigation menu for a user based on their permission group.

#### `POST /navigation/agent` — Get Agent Navigation Menu
Returns both the agent panel navigation and the control panel (CPanel) navigation for an agent, based on their permission group.

**Request Body (both):**
```json
{
  "sessionKey": "uuid-v1-token",
  "clientType": 1,
  "department": 1,
  "group": 2
}
```

**Success Response (user navigation):**
```json
{
  "status": true,
  "mainPanelNavigation": {
    "firstLevel": { "count": 5, "rows": [...] },
    "secondLevel": { "count": 8, "rows": [...] },
    "thirdLevel": { "count": 3, "rows": [...] }
  }
}
```

---

### Defaults — `/department` and `/clienttype`

#### `POST /department/read` — Search Departments
Returns up to 20 departments matching a search string. Used to populate department dropdowns in the frontend.

#### `POST /clienttype/read` — List Client Types
Returns all available client types (Superuser, User, Agent). Used to populate role selectors in the frontend.

---

## 7. Security Design

The API implements a **two-factor request authentication** system before any route logic runs:

### Layer 1 — API Key (`X-HD-Key`)
Every request must include a static API key in the `X-HD-Key` header. Requests with a missing or incorrect key are immediately rejected with `401 Unauthorized`.

### Layer 2 — Payload Signature (`X-HD-Sign`)
For requests with a body, the client must also send an `X-HD-Sign` header containing an HMAC-SHA256 hash of the request body (computed using a shared secret). The API independently computes the same hash and compares. If they don't match, the request is rejected. This prevents request tampering.

```
Client computes:  HMAC-SHA256(requestBody, sharedSecret) → X-HD-Sign header
Server computes:  HMAC-SHA256(receivedBody, sharedSecret) → compare with header
```

### Layer 3 — Input Validation
All request bodies are validated using `express-validator` before reaching any controller. Invalid inputs return a `422` with a descriptive message.

### Layer 4 — Session Validation (Protected Routes)
Protected routes (e.g., `/user/read`) run `validateSession` middleware before the controller. This checks that the submitted session key exists in the database, is not expired, and matches the correct `clientType` and `department`.

### Password Security
Passwords are hashed using **bcrypt** with 10 salt rounds before storage. Plain-text passwords are never saved to the database.

### HTTP Security Headers
**Helmet.js** is applied globally, setting secure HTTP headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`) to protect against common web vulnerabilities.

---

## 8. Database Design

The database runs on **Microsoft SQL Server**. Schema is managed via Sequelize migrations. All core tables use **soft deletes** (`paranoid: true`) — records are never permanently deleted, only marked with a `deletedAt` timestamp.

### Core Entities

```
Users                       Agents
──────────────────          ──────────────────────
id                          id
firstName                   firstName
middleName                  middleName
lastName                    lastName
username                    username
password (bcrypt hash)      password (bcrypt hash)
createdAt                   isSuperUser ('Y' / 'N')
updatedAt                   createdAt
deletedAt (soft delete)     updatedAt
                            deletedAt (soft delete)

UserConfigurations          AgentConfigurations
──────────────────────      ──────────────────────────
id                          id
userId → Users.id           agentId → Agents.id
email                       email
departmentId                departmentId
groupId                     teamId
                            groupId

Sessions
──────────────────────
id
clientId
clientType (0/1/2)
departmentId
sessionKey (UUID v1)
expiredAt (24hr TTL)
createdAt
```

### Supporting Entities

| Table | Purpose |
|---|---|
| `Departments` | Organizational units users and agents belong to |
| `Teams` | Sub-groups within a department (agents only) |
| `UserGroups` | Permission groups for users |
| `AgentGroups` | Permission groups for agents |
| `Navigation` | Menu items with panel, level, URL, icon data |
| `UserGroupNavigations` | Maps user groups to their allowed navigation items |
| `AgentGroupNavigations` | Maps agent groups to their allowed navigation items |
| `ClientTypes` | Lookup table for role types (Superuser, User, Agent) |
| `SubDepartments` | Sub-divisions within departments |
| `Flags` | General-purpose feature/configuration flags |

### Key Relationships

- A **User** has one `UserConfiguration` (email, department, group assignment)
- An **Agent** has one `AgentConfiguration` (email, department, team, group assignment)
- **Navigation menus** are permission-based: items are linked to groups, not directly to users
- **Sessions** store `clientType` + `departmentId` alongside the session key, so the same person can have isolated sessions per department

---

## 9. Project Structure

```
hd-api-development/
│
├── app.js                    # Server entry point — middleware setup, route loading
├── constants.js              # Shared constants (API key, error messages)
├── package.json
│
├── config/
│   └── config.json           # Database connection config (dev/prod environments)
│
├── models/                   # Sequelize models — one file per database table
│   ├── index.js              # Auto-loads all models, runs associations, tests DB connection
│   ├── user.js
│   ├── agent.js
│   ├── session.js
│   ├── department.js
│   ├── navigation.js
│   └── ...
│
├── migrations/               # Database schema version history (Sequelize CLI)
├── seeders/                  # Initial/sample data scripts
│
├── routes/                   # Route definitions — map HTTP paths to controllers
│   ├── index.js              # Registers all routes with the Express app
│   ├── auth.route.js
│   ├── session.route.js
│   ├── signup.route.js
│   ├── user.route.js
│   ├── navigation.route.js
│   └── defaults/
│       ├── clientType.route.js
│       └── department.route.js
│
├── controllers/              # Business logic — one file per feature area
│   ├── auth.controller.js    # Login, logout
│   ├── session.controller.js # Session create/validate/destroy
│   ├── signup.controller.js  # User registration
│   ├── user.controller.js    # User listing with search + pagination
│   ├── navigation.controller.js # Dynamic nav menus
│   └── defaults/
│       ├── clientType.controller.js
│       └── department.controller.js
│
├── requests/                 # Input validation rules (express-validator)
│   ├── auth/
│   ├── session/
│   ├── signup/
│   ├── user/
│   ├── navigation/
│   └── defaults/
│
├── middlewares/
│   ├── payload.middleware.js   # API key + HMAC signature verification
│   └── validation.middleware.js # Extracts express-validator errors
│
└── helpers/
    ├── bcrypt.helper.js        # Password hash + compare
    ├── crypto.helper.js        # HMAC-SHA256 signature generator
    ├── uuid.helper.js          # UUID v1 session key generator
    └── date.helper.js          # Formatted current date utility
```

---

## 10. Key Technical Decisions

**Why raw SQL for the user listing?**
The user listing endpoint supports full-text search across multiple joined tables including computed columns (like `Active`/`Inactive` status and formatted dates). Sequelize's ORM query builder has limitations with `LIKE` on computed expressions, so raw parameterized SQL was used for that specific query while still using Sequelize's connection and transaction management. Parameterized queries with `:replacements` prevent SQL injection.

**Why UUID v1 for session keys?**
UUID v1 includes a timestamp component, making each token time-ordered and guaranteed unique across sessions. This is suitable for session token use where traceability and uniqueness are both important.

**Why soft deletes (`paranoid: true`) on all models?**
Records marked for deletion retain their history in the database. This is important in multi-user systems for audit trails — you can always see when an account was deactivated without losing the data.

**Why per-role login handlers?**
Superusers, Users, and Agents have different data shapes and association requirements (e.g., only Agents have Teams; Superusers skip department filtering). Keeping them in separate handlers (`_loginSuperuserHandler`, `_loginUserHandler`, `_loginAgentHandler`) makes each path explicit and independently maintainable rather than tangled in conditional logic.

**Why department-scoped sessions?**
Sessions store both `clientType` and `departmentId`. This allows the same person to potentially operate in multiple department contexts independently, and ensures session validation always confirms both who you are and which department context you're operating in.
