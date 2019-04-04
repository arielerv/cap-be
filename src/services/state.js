const {State} = require('../model');

class StateService {
    static fetch() {
        return State.find().lean().exec();
    }

    static find(id) {
        return State.findById(id, {departments: 1}).lean().exec();
    }
}

module.exports = StateService;
