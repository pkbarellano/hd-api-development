const { body } = require('express-validator');

exports.validate = () => {
    return [
        body('group')
            .exists().withMessage("Group is required.")
            .isNumeric().withMessage("Group must consist of numbers only.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Group must contain a minimum of 1 character and cannot exceed 10 characters.")
    ];
};