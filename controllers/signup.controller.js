const { sequelize, User, UserGroup, UserConfiguration } = require('../models');
const validation = require('../middlewares/validation.middleware');
const { encryptPassword } = require('../helpers/bcrypt.helper');
const { QUERY_ERROR } = require('../constants');

const _findOneUserQuery = async (body, next) => {

    try {

        return await User.findOne({
            attributes: ['id'],
            where: {
                username: body.username
            },
            include: [
                {
                    model: UserConfiguration,
                    as: 'UserConfigurations',
                    required: false,
                    attributes: ['departmentId'],
                    where: {
                        departmentId: body.department
                    }
                }
            ]
        }).then(data => {

            return data;
        });
    } catch (err) {

        console.error(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _createUserQuery = async (body, res, next) => {

    let password = encryptPassword(body.password);

    try {

        const group = await UserGroup.findOne({
            attributes: ['id'],
            where: {
                departmentId: body.department,
                isDefault: 'Y'
            }
        });

        await sequelize.transaction(async transaction => {

            const user = await User.create({
                firstName: body.firstName,
                middleName: body.middleName,
                lastName: body.lastName,
                username: body.username,
                password: password,
            },
                { transaction });

            await UserConfiguration.create({
                userId: user.id,
                email: body.email,
                departmentId: body.department,
                teamId: 0,
                groupId: group.id
            },
                { transaction });
        });
    } catch (err) {

        console.error(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }
};

const _createUserAccessHandler = async (req, res, next) => {

    const body = req.body;

    const findOneUser = await _findOneUserQuery(body, next);

    if (findOneUser === null) {

        await _createUserQuery(body, res, next);

        res.status(200).send({
            status: true,
            message: "You are successfully registered."
        });
    } else {

        res.status(200).send({
            status: false,
            message: "The chosen username is already in use."
        });
    }
};

const create = (req, res, next) => {

    validation.validateResult(req, res, next);

    _createUserAccessHandler(req, res, next);
};

module.exports = {
    create: create
}