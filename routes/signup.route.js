const express = require('express');
const router = express.Router();
const signup = require('../controllers/signup.controller');
const createRequest = require('../requests/signup/create.request');


module.exports = (app) => {

    router.post('/create', createRequest.validate(), signup.create);

    app.use('/signup', router);
};