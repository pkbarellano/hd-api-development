const validation = require('../middlewares/validation.middleware');
const {
    User,
    UserConfiguration,
    Agent,
    AgentConfiguration,
    Department,
    Team,
    UserGroup,
    AgentGroup
} = require('../models');
const { Op } = require('sequelize');
const { comparePassword } = require('../helpers/bcrypt.helper');
const { QUERY_ERROR, SESSION_TERMINATION_ERROR } = require('../constants');
const {
    disableInactiveSession,
    createSession,
    destroySession
} = require('./session.controller');
const { uuidV1 } = require('../helpers/uuid.helper')

const _findOneAgent = (body, isSuperUser, res, next) => {

    try {

        Agent.belongsToMany(Department, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherKey: 'departmentId'
        });

        Agent.belongsToMany(Team, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherkey: 'teamId'
        });

        Agent.belongsToMany(AgentGroup, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherKey: 'groupId'
        });

        return Agent.findOne({
            attributes: ['id', 'username', 'password', 'firstName', 'middleName', 'lastName'],
            where: {
                [Op.and]: [
                    { username: body.username },
                    { isSuperUser: isSuperUser }
                ]
            },
            include: [
                {
                    model: AgentConfiguration,
                    required: true,
                    attributes: ['email'],
                },
                {
                    model: Department,
                    required: (isSuperUser === 'N') ? true : false,
                    attributes: ['id', 'departmentName'],
                    where: {
                        id: body.department
                    },
                },
                {
                    model: Team,
                    required: false,
                    attributes: ['id', 'teamName'],
                },
                {
                    model: AgentGroup,
                    required: false,
                    attributes: ['id', 'groupName'],
                }
            ]
        }).then(data => {

            return data;
        });

    } catch (err) {

        next(err);

        console.log(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _sessionHandler = async (res, next, id, clientType, department, sessionKey) => {

    await disableInactiveSession(res, next, id, clientType, department);

    await createSession(res, next, id, clientType, department, sessionKey);
};

const _loginSuperuserHandler = async (body, res, next) => {

    const findOneAgent = await _findOneAgent(body, 'Y', res, next);

    if (findOneAgent === null) {

        res.status(200).send({
            status: false,
            message: "Your username is incorrect."
        });

        process.exit();
    }

    const passwordCheck = comparePassword(body.password, findOneAgent.password);

    if (passwordCheck === false) {

        res.status(200).send({
            status: false,
            message: "Your password is incorrect."
        });

        process.exit();
    }

    const sessionKey = uuidV1();

    await _sessionHandler(res, next, findOneAgent.id, body.clientType, body.department, sessionKey);

    res.status(200).send({
        status: true,
        data: {
            sessionKey: sessionKey,
            firstName: findOneAgent.firstName,
            middleName: findOneAgent.middleName,
            lastName: findOneAgent.lastName,
            username: findOneAgent.username,
            email: (findOneAgent.AgentConfigurations.length === 1) ? findOneAgent.AgentConfigurations[0].email : null,
            department: (findOneAgent.Departments.length === 1) ? findOneAgent.Departments[0].id : 0,
            departmentName: (findOneAgent.Departments.length === 1) ? findOneAgent.Departments[0].departmentName : null,
            team: (findOneAgent.Teams.length === 1) ? findOneAgent.Teams[0].id : 0,
            teamName: (findOneAgent.Teams.length === 1) ? findOneAgent.Teams[0].teamName : null,
            group: (findOneAgent.AgentGroups.length === 1) ? findOneAgent.AgentGroups[0].id : 0,
            groupName: (findOneAgent.AgentGroups.length === 1) ? findOneAgent.AgentGroups[0].groupName : null,
            clientType: body.clientType,
            clientTypeName: 'agent'
        }
    })
};

const _findOneUser = (body, res, next) => {

    try {

        User.belongsToMany(Department, {
            through: 'UserConfiguration',
            foreignKey: 'userId',
            otherKey: 'departmentId'
        });

        User.belongsToMany(UserGroup, {
            through: 'UserConfiguration',
            foreignKey: 'userId',
            otherKey: 'groupId'
        });

        return User.findOne({
            attributes: ['id', 'username', 'password', 'firstName', 'middleName', 'lastName'],
            where: {
                [Op.and]: [
                    { username: body.username }
                ]
            },
            include: [
                {
                    model: UserConfiguration,
                    required: true,
                    attributes: ['email']
                },
                {
                    model: Department,
                    required: true,
                    attributes: ['id', 'departmentName'],
                    where: {
                        id: body.department
                    }
                },
                {
                    model: UserGroup,
                    required: false,
                    attributes: ['id', 'groupName']
                }
            ]
        }).then(data => {

            return data;
        });

    } catch (err) {

        next(err);

        console.log(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _loginUserHandler = async (body, res, next) => {

    const findOneUser = await _findOneUser(body, res, next);

    if (findOneUser === null) {

        res.status(200).send({
            status: false,
            message: "Your username is incorrect."
        });

        process.exit();
    }

    const passwordCheck = comparePassword(body.password, findOneUser.password);

    if (passwordCheck === false) {

        res.status(200).send({
            status: false,
            message: "Your password is incorrect."
        });

        process.exit();
    }

    const sessionKey = uuidV1();

    await _sessionHandler(res, next, findOneUser.id, body.clientType, body.department, sessionKey);

    res.status(200).send({
        status: true,
        data: {
            sessionKey: sessionKey,
            firstName: findOneUser.firstName,
            middleName: findOneUser.middleName,
            lastName: findOneUser.lastName,
            username: findOneUser.username,
            email: (findOneUser.UserConfigurations.length === 1) ? findOneUser.UserConfigurations[0].email : null,
            department: (findOneUser.Departments.length === 1) ? findOneUser.Departments[0].id : 0,
            departmentName: (findOneUser.Departments.length === 1) ? findOneUser.Departments[0].departmentName : null,
            team: 0,
            teamName: null,
            group: (findOneUser.UserGroups.length === 1) ? findOneUser.UserGroups[0].id : 0,
            groupName: (findOneUser.UserGroups.length === 1) ? findOneUser.UserGroups[0].groupName : null,
            clientType: body.clientType,
            clientTypeName: 'user'
        }
    });
};

const _loginAgentHandler = async (body, res, next) => {

    const findOneAgent = await _findOneAgent(body, 'N', res, next);

    if (findOneAgent === null) {

        res.status(200).send({
            status: false,
            message: "Your username is incorrect."
        });

        process.exit();
    }

    const passwordCheck = comparePassword(body.password, findOneAgent.password);

    if (passwordCheck === false) {

        res.status(200).send({
            status: false,
            message: "Your password is incorrect."
        });

        process.exit();
    }

    const sessionKey = uuidV1();

    await _sessionHandler(res, next, findOneAgent.id, body.clientType, body.department, sessionKey);

    res.status(200).send({
        status: true,
        data: {
            sessionKey: sessionKey,
            firstName: findOneAgent.firstName,
            middleName: findOneAgent.middleName,
            lastName: findOneAgent.lastName,
            username: findOneAgent.username,
            email: (findOneAgent.AgentConfigurations.length === 1) ? findOneAgent.AgentConfigurations[0].email : null,
            department: (findOneAgent.Departments.length === 1) ? findOneAgent.Departments[0].id : 0,
            departmentName: (findOneAgent.Departments.length === 1) ? findOneAgent.Departments[0].departmentName : null,
            team: (findOneAgent.Teams.length === 1) ? findOneAgent.Teams[0].id : 0,
            teamName: (findOneAgent.Teams.length === 1) ? findOneAgent.Teams[0].teamName : null,
            group: (findOneAgent.AgentGroups.length === 1) ? findOneAgent.AgentGroups[0].id : 0,
            groupName: (findOneAgent.AgentGroups.length === 1) ? findOneAgent.AgentGroups[0].groupName : null,
            clientType: body.clientType,
            clientTypeName: 'agent'
        }
    });
};

const _authenticateHandler = async (req, res, next) => {

    const body = req.body;

    if (body.clientType === 0) {

        _loginSuperuserHandler(body, res, next);
    }

    if (body.clientType === 1) {

        _loginUserHandler(body, res, next);
    }

    if (body.clientType === 2) {

        _loginAgentHandler(body, res, next);
    }
};

const read = (req, res, next) => {

    validation.validateResult(req, res, next);

    _authenticateHandler(req, res, next);
};

const _destroySessionHandler = async (req, res, next) => {

    try {

        const body = req.body;

        await destroySession(body.sessionKey, body.clientType, body.department);

        res.status(200).send({
            status: true,
            message: "Your session was successfully terminated."
        });

    } catch (err) {

        console.error(err);

        res.status(422).send({
            message: SESSION_TERMINATION_ERROR
        });
    }
};

const destroy = (req, res, next) => {

    validation.validateResult(req, res, next);

    _destroySessionHandler(req, res, next);
};

module.exports = {
    read: read,
    destroy: destroy
};