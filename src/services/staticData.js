const {Roles} = require('../model');

class StaticDataService {
    static fetchRoles() {
        return Roles.find({}).lean().exec();
    }
}

module.exports = StaticDataService;
