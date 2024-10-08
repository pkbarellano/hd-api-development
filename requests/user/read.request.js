const { body } = require('express-validator');

exports.validate = () => {
    return [
        body('sessionKey')
            .exists().withMessage("Session Key is required.")
            .isString().withMessage("Session Key is required.")
            .isLength({
                min: 0,
                max: 255
            }).withMessage("Session Key cannot exceed 255 characters."),
        body('clientType')
            .exists().withMessage("Client Type is required.")
            .isNumeric().withMessage("Client Type must consist of numbers only.")
            .isInt({
                min: 0,
                max: 2
            }).withMessage("Client Type must be between 0 to 2 only.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Client Type must contain a minimum of 1 character and cannot exceed 10 characters."),
        body('department')
            .exists().withMessage("Department is required.")
            .isNumeric().withMessage("Department must consist of numbers only.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Department must contain a minimum of 1 character and cannot exceed 10 characters."),
        body('page')
            .isNumeric().withMessage("Page must consist of numbers only.")
            .isLength({ min: 1 }).withMessage("Page must contain a minimum of 1 character."),
        body('rowsPerPage')
            .isNumeric().withMessage("Rows Per Page must consist of numbers only.")
            .isLength({ min: 1 }).withMessage("Rows Per Page must contain of 1 character.")
    ];
};