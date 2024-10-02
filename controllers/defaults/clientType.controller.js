const { ClientType } = require('../../models');
const { QUERY_ERROR } = require('../../constants');

const _getClientTypes = async (res, next) => {

    try {
        const clientType = await ClientType.findAll({
            attributes: ['id', 'clientTypeName']
        });

        res.status(200).send({
            status: true,
            data: clientType
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

    _getClientTypes(res, next);
};

module.exports = {
    read: read
};