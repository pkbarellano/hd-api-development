const { validationResult } = require('express-validator');

exports.validateResult = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log(errors);

        res.status(422).send({
            status: false,
            message: errors.errors[0].msg
        });

        process.exit();
    }
};