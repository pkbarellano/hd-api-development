const { body } = require('express-validator');

exports.validate = () => {
    return [
        body('search')
            .isString().withMessage("The search query must consist of string data type.")
            .isLength({
                max: 200
            }).withMessage("The search query must not exceed 200 characters.")
            .optional()
    ];
};