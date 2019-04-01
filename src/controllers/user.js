const {UserService} = require('../services');

class UserController {
    static async fetchCurrent(req, res, next) {
        try {
            res.send({user: req.user});
        } catch (err) {
            next(err);
        }
    }

    static async fetch(req, res, next) {
        try {
            res.send({users: await UserService.fetch()});
        } catch (err) {
            next(err);
        }
    }

    static async find(req, res, next) {
        try {
            res.send({user: await UserService.find(req.params.id)});
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            await UserService.update(req.params.id, req.body.user);
            res.send({success: true});
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            await UserService.create(req.body.user);

            res.send({success: true});
        } catch (err) {
            next(err);
        }
    }

    static async remove(req, res, next) {
        try {
            await UserService.remove(req.params.id);
            res.send({success: true});
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;
