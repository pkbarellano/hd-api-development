const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const sessionReadRequest = require('../requests/session/read.request');
const userController = require('../controllers/user.controller');
const userReadRequest = require('../requests/user/read.request');

module.exports = (app) => {

    router.post('/read', sessionReadRequest.validate(), sessionController.validateSession, userReadRequest.validate(), userController.read);

    app.use('/user', router);
};