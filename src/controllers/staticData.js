const {StaticDataService} = require('../services');

class StaticDataController {
    static async fetchAll(req, res, next) {
        try {
            res.send({
                roles: await StaticDataService.fetchRoles()
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StaticDataController;
