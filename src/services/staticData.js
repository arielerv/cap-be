const {Roles, State, Career} = require('../model');

class StaticDataService {
    static fetchRoles() {
        return Roles.find({}).lean().exec();
    }

    static fetchStates() {
        return State.find({}, {departments: 0}).lean().exec();
    }

    static fetchCareers() {
        return Career.find().lean().exec();
    }
}

module.exports = StaticDataService;
