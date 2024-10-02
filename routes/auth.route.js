const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const readRequest = require('../requests/auth/read.request');
const destroyRequest = require('../requests/auth/destroy.request');

module.exports = (app) => {

    router.post('/read', readRequest.validate(), authController.read);

    router.post('/destroy', destroyRequest.validate(), authController.destroy);

    app.use('/auth', router);
};