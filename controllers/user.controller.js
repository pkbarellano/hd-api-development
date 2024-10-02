const validation = require('../middlewares/validation.middleware');
const { QUERY_ERROR } = require('../constants');
const {
    sequelize,
    User,
    UserConfiguration,
    Department,
    UserGroup
} = require('../models');
const { Op } = require('sequelize');

const _getUsers = (body, res, next) => {

    try {

        let departmentWhere = {};

        if (body.clientType === 1) {

            departmentWhere = { id: body.department };
        }

        User.belongsToMany(Department, {
            through: 'UserConfiguration',
            foreignKey: 'userId',
            otherKey: 'departmentId',
        });

        User.belongsToMany(UserGroup, {
            through: 'UserConfiguration',
            foreignKey: 'userId',
            otherKey: 'groupId'
        });

        return User.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'middleName',
                'lastName',
                'username',
                [sequelize.fn('FORMAT', sequelize.col('User.createdAt'), 'yyyy-mm-dd hh:mm'), 'createdAt'],
                [sequelize.fn('FORMAT', sequelize.col('User.updatedAt'), 'yyyy-mm-dd hh:mm'), 'updatedAt'],
                [sequelize.fn('FORMAT', sequelize.col('User.deletedAt'), 'yyyy-mm-dd hh:mm'), 'deletedAt']
            ],
            include: [
                {
                    model: UserConfiguration,
                    required: true,
                    attributes: ['email']
                },
                {
                    model: Department,
                    required: true,
                    attributes: ['departmentName'],
                    where: departmentWhere
                },
                {
                    model: UserGroup,
                    required: true,
                    attributes: ['groupName']
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

const _listHandler = async (req, res, next) => {

    const body = req.body;

    if (![0, 1].includes(body.clientType)) {

        res.status(422).send({
            message: 'You do not have permission to view all clients.'
        });

        process.exit();
    }

    const getUsers = await _getUsers(body, res, next);

    let data = [];

    if (getUsers.count > 0) {

        data = getUsers.rows.map(item => {

            return {
                id: item.id,
                firstName: item.firstName,
                middleName: item.middleName,
                lastName: item.lastName,
                username: item.username,
                email: item.UserConfigurations[0].email,
                department: item.Departments[0].departmentName,
                group: item.UserGroups[0].groupName,
                status: (item.deletedAt === null) ? 'Active' : 'Inactive',
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt
            }
        });
    }

    res.status(200).send({
        data: data
    });
};

const read = (req, res, next) => {

    validation.validateResult(req, res, next);

    _listHandler(req, res, next);
};

module.exports = {
    read: read
};