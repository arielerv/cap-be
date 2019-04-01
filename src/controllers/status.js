const {StatusService} = require('../services');
const {name, description, version} = require('../../package');

class StatusController {
    static ping(req, res, next) {
        try {
            res.send({name, description , version});
        } catch (err) {
            next(err);
        }
    }

    static status(req, res, next) {
        try {
            res.send(StatusService.getStatus());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StatusController;
