const express = require('express');
const router = express.Router();
const clientTypeController = require('../../controllers/defaults/clientType.controller');

module.exports = (app) => {

    router.post('/read', clientTypeController.read);

    app.use('/clienttype', router);
};