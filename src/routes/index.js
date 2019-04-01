const {Router} = require('express');

const authenticate = require('./middlewares/authenticate');

class Routes {
    static configure(app) {
        const {StatusController} = require('../controllers');

        app.get('/ping', StatusController.ping);
        app.get('/status', StatusController.status);
        app.use('/auth', require('cors')(), require('./auth')(Router()));
        app.use('/api', authenticate(), require('./api')(Router()));
    }
}

module.exports = Routes;
