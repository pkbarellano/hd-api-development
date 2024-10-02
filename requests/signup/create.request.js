const { body } = require('express-validator');

exports.validate = () => {
    return [
        body('department')
            .exists().withMessage("Department is required.")
            .isNumeric().withMessage("Department must consist of numbers only.")
            .isLength({
                min: 1,
                max: 10
            }).withMessage("Department must contain a minimum of 1 character and cannot exceed 10 characters."),
        body('firstName')
            .exists().withMessage("First Name is required.")
            .isString().withMessage("First Name is required.")
            .isLength({
                min: 1,
                max: 50
            }).withMessage("First Name must contain a minimum of 1 character and cannot exceed 50 characters."),
        body('middleName')
            .exists().withMessage("Middle Name is required.")
            .isString().withMessage("Middle Name is required.")
            .isLength({
                min: 1,
                max: 30
            }).withMessage("Middle Name must contain a minimum of 1 character and cannot exceed 30 characters."),
        body('lastName')
            .exists().withMessage("Last Name is required.")
            .isString().withMessage("Last Name is required.")
            .isLength({
                min: 1,
                max: 50
            }).withMessage("Last Name must contain a minimum of 1 character and cannot exceed 50 characters."),
        body('email')
            .exists().withMessage("Email is required.")
            .isEmail().withMessage("Email must consist of valid email address only.")
            .isLength({
                min: 10,
                max: 100
            }).withMessage("Email must contain a minimum of 10 characters and cannot exceed 100 characters."),
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
    ];
};