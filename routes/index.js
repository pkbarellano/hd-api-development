module.exports = (app, router) => {

    require('./signup.route')(app, router);

    require('./defaults/department.route')(app, router);

    require('./defaults/clientType.route')(app, router);

    require('./auth.route')(app, router);

    require('./session.route')(app, router);

    require('./navigation.route')(app, router);

    require('./user.route')(app, router);
};