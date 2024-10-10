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

const _getUsers = async (body, res, next) => {

    try {

        // let departmentWhere = {};

        // if (body.clientType === 1) {

        //     departmentWhere = { id: body.department };
        // }

        // User.belongsToMany(Department, {
        //     through: 'UserConfiguration',
        //     foreignKey: 'userId',
        //     otherKey: 'departmentId',
        // });

        // User.belongsToMany(UserGroup, {
        //     through: 'UserConfiguration',
        //     foreignKey: 'userId',
        //     otherKey: 'groupId'
        // });

        // return User.findAndCountAll({
        //     attributes: [
        //         'id',
        //         'firstName',
        //         'middleName',
        //         'lastName',
        //         'username',
        //         [sequelize.fn('FORMAT', sequelize.col('User.createdAt'), 'yyyy-mm-dd hh:mm'), 'createdAt'],
        //         [sequelize.fn('FORMAT', sequelize.col('User.updatedAt'), 'yyyy-mm-dd hh:mm'), 'updatedAt'],
        //         [sequelize.fn('FORMAT', sequelize.col('User.deletedAt'), 'yyyy-mm-dd hh:mm'), 'deletedAt']
        //     ],
        //     include: [
        //         {
        //             model: UserConfiguration,
        //             required: true,
        //             attributes: ['email']
        //         },
        //         {
        //             model: Department,
        //             required: true,
        //             attributes: ['departmentName'],
        //             where: departmentWhere
        //         },
        //         {
        //             model: UserGroup,
        //             required: true,
        //             attributes: ['groupName']
        //         }
        //     ],
        //     where: {
        //         [Op.or]: [
        //             { firstName: { [Op.like]: `%${body.search}%` } },
        //             { middleName: { [Op.like]: `%${body.search}%` } },
        //             { lastName: { [Op.like]: `%${body.search}%` } },
        //             { username: { [Op.like]: `%${body.search}%` } },
        //             sequelize.where(sequelize.col('UserConfigurations.email'), { [Op.like]: `%${body.search}%` })
        //         ]
        //     },
        //     offset: body.page,
        //     limit: body.rowsPerPage
        // }).then(data => {

        //     return data;
        // });

        let departmentWhere = ``;

        if (body.clientType !== 0) {

            departmentWhere = `Departments.id = ${body.department} AND`;
        }

        const queryCount = `
            SELECT
                COUNT( Users.id ) as count
            FROM
                Users
                INNER JOIN UserConfigurations ON Users.id = UserConfigurations.userId
                INNER JOIN Departments ON UserConfigurations.departmentId = Departments.id
                INNER JOIN UserGroups ON UserConfigurations.groupId = UserGroups.id 
            WHERE
                Users.deletedAt IS NULL
                ${departmentWhere} 
                AND (
                    Users.firstName LIKE :search 
                    OR Users.middleName LIKE :search 
                    OR Users.lastName LIKE :search 
                    OR Users.username LIKE :search 
                    OR UserConfigurations.email LIKE :search 
                    OR Departments.departmentName LIKE :search
                    OR UserGroups.groupName LIKE :search
                    OR CASE
                        WHEN Users.deletedAt IS NULL THEN 'Active' 
                        ELSE 'Inactive' 
                        END LIKE :search
                    OR FORMAT( Users.createdAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                    OR FORMAT( Users.updatedAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                    OR FORMAT( Users.deletedAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                ) 
        `;

        const countResult = await sequelize.query(queryCount, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                search: `%${body.search}%`
            }
        }).then(data => {

            return data[0].count;
        });

        const query = `
            SELECT
                Users.id,
                Users.firstName,
                Users.middleName,
                Users.lastName,
                Users.username,
                FORMAT( Users.createdAt, 'yyyy-MM-dd HH:mm' ) AS createdAt,
                FORMAT( Users.updatedAt, 'yyyy-MM-dd HH:mm' ) AS updatedAt,
                FORMAT( Users.deletedAt, 'yyyy-MM-dd HH:mm' ) AS deletedAt,
                UserConfigurations.email,
                Departments.departmentName,
                UserGroups.groupName,
                CASE
                WHEN Users.deletedAt IS NULL THEN 'Active' 
                ELSE 'Inactive' 
                END AS stat
            FROM
                Users
                INNER JOIN UserConfigurations ON Users.id = UserConfigurations.userId
                INNER JOIN Departments ON UserConfigurations.departmentId = Departments.id
                INNER JOIN UserGroups ON UserConfigurations.groupId = UserGroups.id 
            WHERE
                Users.deletedAt IS NULL
                ${departmentWhere} 
                AND (
                    Users.firstName LIKE :search 
                    OR Users.middleName LIKE :search 
                    OR Users.lastName LIKE :search 
                    OR Users.username LIKE :search 
                    OR UserConfigurations.email LIKE :search 
                    OR Departments.departmentName LIKE :search
                    OR UserGroups.groupName LIKE :search
                    OR CASE
                        WHEN Users.deletedAt IS NULL THEN 'Active' 
                        ELSE 'Inactive' 
                        END LIKE :search
                    OR FORMAT( Users.createdAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                    OR FORMAT( Users.updatedAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                    OR FORMAT( Users.deletedAt, 'yyyy-MM-dd HH:mm' ) LIKE :search
                ) 
            ORDER BY
                Users.id 
            OFFSET :offset ROWS 
            FETCH NEXT :limit ROWS ONLY;
        `;

        const rows = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                search: `%${body.search}%`,
                offset: body.page * body.rowsPerPage,
                limit: body.rowsPerPage
            }
        }).then(data => {

            return data;
        });

        return {
            count: countResult,
            rows: rows
        };

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
                email: item.email,
                department: item.departmentName,
                group: item.groupName,
                status: item.stat,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt
            }
        });
    }

    res.status(200).send({
        count: getUsers.count,
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