const validation = require('../middlewares/validation.middleware');
const {
    UserGroupNavigation,
    AgentGroupNavigation,
    Navigation
} = require('../models');
const { Op } = require('sequelize');
const { QUERY_ERROR, NO_NAVIGATION } = require('../constants');

const _findUserNavigation = async (body, res, next) => {

    const firstLevel = await _userFirstLevelNavigation(body, res, next);

    const secondLevel = await _userSecondLevelNavigation(body, res, next);

    const thirdLevel = await _userThirdLevelNavigation(body, res, next);

    if (firstLevel.count < 1) {

        res.status(422).send({
            message: NO_NAVIGATION
        });

        process.exit();
    }

    return {
        firstLevel: firstLevel,
        secondLevel: secondLevel,
        thirdLevel: thirdLevel
    };
};

const _userFirstLevelNavigation = async (body, res, next) => {

    try {

        return UserGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'icon'],
                    where: {
                        panel: 'USER',
                        secondLevel: 0,
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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

const _userSecondLevelNavigation = async (body, res, next) => {

    try {

        return UserGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'icon'],
                    where: {
                        panel: 'USER',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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
}

const _userThirdLevelNavigation = async (body, res, next) => {

    try {

        return UserGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'thirdLevel', 'icon'],
                    where: {
                        panel: 'USER',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: {
                            [Op.gt]: 0
                        }
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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
}

const _userNavigationHandler = async (req, res, next) => {

    const body = req.body;

    const navigation = await _findUserNavigation(body, res, next);

    res.status(200).send({
        status: true,
        mainPanelNavigation: navigation
    });
}

const userNavigation = (req, res, next) => {

    validation.validateResult(req, res, next);

    _userNavigationHandler(req, res, next);
};

const _agentFirstLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'icon'],
                    where: {
                        panel: 'AGENT',
                        secondLevel: 0,
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
                }
            ]
        });
    } catch (err) {

        next(err);

        console.log(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _agentSecondLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'icon'],
                    where: {
                        panel: 'AGENT',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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

const _agentThirdLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'thirdLevel', 'icon'],
                    where: {
                        panel: 'AGENT',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: {
                            [Op.gt]: 0
                        }
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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

const _findAgentNavigation = async (body, res, next) => {

    const firstLevel = await _agentFirstLevelNavigation(body, res, next);

    const secondLevel = await _agentSecondLevelNavigation(body, res, next);

    const thirdLevel = await _agentThirdLevelNavigation(body, res, next);

    if (firstLevel.count < 1) {

        res.status(422).send({
            message: NO_NAVIGATION
        });

        process.exit();
    }

    return {
        firstLevel: firstLevel,
        secondLevel: secondLevel,
        thirdLevel: thirdLevel
    };
}

const _cPanelFirstLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'icon'],
                    where: {
                        panel: 'CPANEL',
                        secondLevel: 0,
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
                }
            ]
        });
    } catch (err) {

        next(err);

        console.log(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _cPanelSecondLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'icon'],
                    where: {
                        panel: 'CPANEL',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: 0
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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

const _cPanelThirdLevelNavigation = async (body, res, next) => {

    try {

        return AgentGroupNavigation.findAndCountAll({
            where: {
                groupId: body.group
            },
            include: [
                {
                    model: Navigation,
                    required: true,
                    attributes: ['name', 'label', 'url', 'hasSub', 'firstLevel', 'secondLevel', 'thirdLevel', 'icon'],
                    where: {
                        panel: 'CPANEL',
                        secondLevel: {
                            [Op.gt]: 0
                        },
                        thirdLevel: {
                            [Op.gt]: 0
                        }
                    },
                    order: [
                        ['menuOrder', 'ASC']
                    ]
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

const _findCPanelNavigation = async (body, res, next) => {

    const firstLevel = await _cPanelFirstLevelNavigation(body, res, next);

    const secondLevel = await _cPanelSecondLevelNavigation(body, res, next);

    const thirdLevel = await _cPanelThirdLevelNavigation(body, res, next);

    return {
        firstLevel: firstLevel,
        secondLevel: secondLevel,
        thirdLevel: thirdLevel
    };
};

const _agentNavigationHandler = async (req, res, next) => {

    const body = req.body;

    const agentPanelNavigation = await _findAgentNavigation(body, res, next);

    const cPanelNavigation = await _findCPanelNavigation(body, res, next);

    res.status(200).send({
        status: true,
        mainPanelNavigation: agentPanelNavigation,
        cPanelNavigation: cPanelNavigation
    });
};

const agentNavigation = (req, res, next) => {

    validation.validateResult(req, res, next);

    _agentNavigationHandler(req, res, next);
};

module.exports = {
    userNavigation: userNavigation,
    agentNavigation: agentNavigation
};