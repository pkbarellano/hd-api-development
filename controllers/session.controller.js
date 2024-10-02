const validation = require('../middlewares/validation.middleware');
const { QUERY_ERROR, SESSION_TERMINATION_ERROR } = require('../constants');
const {
    sequelize,
    Session,
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

const createSession = async (res, next, clientId, clientType, departmentId, sessionKey) => {

    try {

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        await sequelize.transaction(async transaction => {

            await Session.create({
                clientId: clientId,
                clientType: clientType,
                departmentId: departmentId,
                sessionKey: sessionKey,
                expiredAt: expiryDate
            },
                { transaction });
        });

    } catch (err) {

        console.log(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const disableInactiveSession = async (res, next, clientId, clientType, departmentId) => {

    try {

        await sequelize.transaction(async transaction => {

            if (clientType === 0) {

                await Session.destroy({
                    where: {
                        expiredAt: {
                            [Op.lt]: sequelize.literal('GETDATE()')
                        },
                        [Op.and]: [
                            { clientId: clientId },
                            { clientType: clientType }
                        ]
                    }
                },
                    { transaction });
            } else {

                await Session.destroy({
                    where: {
                        expiredAt: {
                            [Op.lt]: sequelize.literal('GETDATE()')
                        },
                        [Op.and]: [
                            { clientId: clientId },
                            { clientType: clientType },
                            { departmentId: departmentId }
                        ]
                    }
                },
                    { transaction });
            }
        });
    } catch (err) {

        console.error(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _findOneActiveSession = (sessionKey, clientType, departmentId, res, next) => {

    try {

        return Session.findAndCountAll({
            attributes: ['clientId'],
            where: {
                [Op.and]: [
                    { clientType: clientType },
                    { departmentId: departmentId },
                    { sessionKey: sessionKey }
                ]
            }
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

const _findOneAgentHandler = (id, isSuperUser, departmentId, res, next) => {

    try {

        Agent.belongsToMany(Department, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherKey: 'departmentId'
        });

        Agent.belongsToMany(Team, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherKey: 'teamId'
        });

        Agent.belongsToMany(AgentGroup, {
            through: 'AgentConfiguration',
            foreignKey: 'agentId',
            otherKey: 'groupId'
        });

        return Agent.findOne({
            attributes: ['id', 'username', 'firstName', 'middleName', 'lastName'],
            where: {
                id: id
            },
            include: [
                {
                    model: AgentConfiguration,
                    required: true,
                    attributes: ['email']
                },
                {
                    model: Department,
                    required: (isSuperUser === 'N') ? true : false,
                    attributes: ['id', 'departmentName'],
                    where: {
                        id: departmentId
                    }
                },
                {
                    model: Team,
                    required: false,
                    attributes: ['id', 'teamName']
                },
                {
                    model: AgentGroup,
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

const _findOneUserHandler = (id, departmentId, res, next) => {

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
            attributes: ['id', 'username', 'firstName', 'middleName', 'lastName'],
            where: {
                id: id
            },
            include: [
                {
                    model: UserConfiguration,
                    required: true,
                    attributes: ['email'],
                },
                {
                    model: Department,
                    required: true,
                    attributes: ['id', 'departmentName'],
                    where: {
                        id: departmentId
                    }
                },
                {
                    model: UserGroup,
                    required: true,
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

const _checkSessionHandler = async (req, res, next,) => {

    const body = req.body;

    if (body.clientType < 0 || body.clientType > 2) {

        res.status(200).send({
            status: false,
            message: "Access type is invalid."
        });

        process.exit();
    }

    const findOneActiveSession = await _findOneActiveSession(body.sessionKey, body.clientType, body.department, res, next);

    if (findOneActiveSession.count === 0 || findOneActiveSession.count > 1) {

        res.status(200).send({
            status: false,
            message: "Your session has ended.",
            data: findOneActiveSession
        });

        process.exit();
    }

    let clientId = findOneActiveSession.rows[0].clientId;
    let isSuperUser = (body.clientType === 0) ? 'Y' : 'N';

    if (body.clientType === 0 || body.clientType === 2) {

        const findOneAgent = await _findOneAgentHandler(clientId, isSuperUser, body.department, res, next);

        res.status(200).send({
            status: true,
            data: {
                sessionKey: body.sessionKey,
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
    }

    if (body.clientType === 1) {

        const findOneUser = await _findOneUserHandler(clientId, body.department, res, next);

        res.status(200).send({
            status: true,
            data: {
                sessionKey: body.sessionKey,
                firstName: findOneUser.firstName,
                middleName: findOneUser.middleName,
                lastName: findOneUser.lastName,
                username: findOneUser.username,
                email: (findOneUser.UserConfigurations.length === 1) ? findOneUser.UserConfigurations[0].email : null,
                department: (findOneUser.Departments.length === 1) ? findOneUser.Departments[0].id : 0,
                departmentName: (findOneUser.Departments.length === 1) ? findOneUser.Departments[0].departmentName : null,
                group: (findOneUser.UserGroups.length === 1) ? findOneUser.UserGroups[0].id : 0,
                groupName: (findOneUser.UserGroups.length === 1) ? findOneUser.UserGroups[0].groupName : null,
                clientType: body.clientType,
                clientTypeName: 'user'
            }
        });
    }
};

const read = (req, res, next) => {

    validation.validateResult(req, res, next);

    _checkSessionHandler(req, res, next);
};

const _validateSessionHandler = async (req, res, next) => {

    const body = req.body;

    if (body.clientType < 0 || body.clientType > 2) {

        res.status(200).send({
            status: false,
            message: "Access type is invalid."
        });

        process.exit();
    }

    const findOneActiveSession = await _findOneActiveSession(body.sessionKey, body.clientType, body.department, res, next);

    if (findOneActiveSession.count === 0 || findOneActiveSession.count > 1) {

        res.status(200).send({
            status: false,
            message: "Your session has ended.",
            data: findOneActiveSession
        });

        process.exit();
    } else {

        next();
    }
};

const validateSession = (req, res, next) => {

    validation.validateResult(req, res, next);

    _validateSessionHandler(req, res, next);
};

const destroySession = async (sessionKey, clientType, departmentId) => {

    try {

        await sequelize.transaction(async transaction => {

            if (clientType === 0) {

                await Session.destroy({
                    where: {
                        [Op.and]: [
                            { clientType: clientType },
                            { sessionKey: sessionKey }
                        ]
                    }
                },
                    { transaction });
            } else {

                await Session.destroy({
                    where: {
                        [Op.and]: [
                            { clientType: clientType },
                            { departmentId: departmentId },
                            { sessionKey: sessionKey }
                        ]
                    }
                },
                    { transaction });
            }
        });

    } catch (err) {

        console.error(err);

        res.status(422).send({
            message: SESSION_TERMINATION_ERROR
        });
    }
};

module.exports = {
    read: read,
    validateSession: validateSession,
    createSession: createSession,
    disableInactiveSession: disableInactiveSession,
    destroySession: destroySession
};