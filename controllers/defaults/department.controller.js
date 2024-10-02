const { Department } = require('../../models');
const validation = require('../../middlewares/validation.middleware');
const { Op } = require('sequelize');
const { QUERY_ERROR } = require('../../constants');

const _getDepartments = async (req, res, next) => {

    const body = req.body;

    try {
        const dept = await Department.findAll({
            attributes: ['id', 'departmentName'],
            where: {
                departmentName: { [Op.like]: `%${body.search}%` }
            },
            limit: 20
        });

        res.status(200).send({
            status: true,
            data: dept
        });
    } catch (err) {

        next(err);

        console.error(err);

        res.status(422).send({
            message: QUERY_ERROR
        });
    }

};

const read = (req, res, next) => {

    validation.validateResult(req, res, next);

    _getDepartments(req, res, next);
};

module.exports = {
    read: read
};