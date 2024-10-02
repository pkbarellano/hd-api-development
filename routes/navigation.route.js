const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigation.controller');
const userNavigationRequest = require('../requests/navigation/userNavigation.request');
const agentNavigationRequest = require('../requests/navigation/agentNavigation.request');

module.exports = app => {

    router.post('/user', userNavigationRequest.validate(), navigationController.userNavigation);

    router.post('/agent', agentNavigationRequest.validate(), navigationController.agentNavigation);

    app.use('/navigation', router);
};