const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/defaults/department.controller');
const readRequest = require('../../requests/defaults/department/read.request');

module.exports = (app) => {

    router.post('/read', readRequest.validate(), departmentController.read);

    app.use('/department', router);
};