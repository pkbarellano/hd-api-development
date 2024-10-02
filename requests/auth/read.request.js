const { body } = require('express-validator');

exports.validate = () => {
    return [
        body('username')
            .exists().withMessage("Username is required.")
            .isString().withMessage("Username is required.")
            .isLength({
                min: 8,
                max: 50
            }).withMessage("Username must contain a minimum of 8 characters and cannot exceed 50 characters."),
        body('password')
            .exists().withMessage("Password is required.")
            .isString().withMessage("Password is required.")
            .isLength({
                min: 8,
                max: 150
            }).withMessage("Password must contain a minimum of 8 characters and cannot exceed 150 characters."),
        body('department')
            .exists().withMessage("Department is required.")
            .isNumeric().withMessage("Department must consist of numbers only.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Department must contain a minimum of 1 character and cannot exceed 10 characters."),
        body("clientType")
            .isNumeric().withMessage("Client Type must consist of numbers only.")
            .isInt({
                min: 0,
                max: 2
            }).withMessage("Client Type must be between 0 to 2.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Client Type must contain a minimum of 1 character and cannot exceed 10 characters.")
    ];
};