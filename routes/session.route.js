const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const readRequest = require('../requests/session/read.request');

module.exports = (app) => {

    router.post('/read', readRequest.validate(), sessionController.read);

    app.use('/session', router);
};