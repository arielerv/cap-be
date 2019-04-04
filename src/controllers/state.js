const {StateService} = require('../services');

class StateController {
    static async find(req, res, next) {
        try {
            const states = await StateService.find(req.params.id);
            res.send(states.departments);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StateController;
