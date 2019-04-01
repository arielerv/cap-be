const {AUTH_CLIENT_SECRET} = process.env;
const jwt = require('jsonwebtoken');
const {some, includes, filter, isNil, get, isEmpty} = require('lodash');
const crypto = require('crypto');

const {RoleEnum, User, BusinessError, Roles} = require('../model');
const EmailService = require('../services/email');
const TokenService = require('../services/token');

const createJWT = user => jwt.sign(user, AUTH_CLIENT_SECRET, {subject: user.surname});
const sendUserUnauthorized = (res, message) => res.status(401).send({message});
const hash = (input, encoding) => crypto.createHash('sha256').update(input).digest(encoding || 'base64');
const validate = (obj, fields) => filter(fields, fieldName => isNil(get(obj, fieldName)) || isEmpty(get(obj, fieldName)));

module.exports = router => {
    router.post('/login', async (req, res, next) => {
        try {
            const user = await User.findOne({
                username: req.body.username,
                password: hash(req.body.password),
                disabled: {$ne: true}
            }, {password: 0}).populate('roles').lean().exec();
            if (!user) {
                return sendUserUnauthorized(res, 'Invalid username and/or password');
            }
            if (!some(user.roles, rol => includes(rol.name, RoleEnum.ADMIN))) {
                return sendUserUnauthorized(res, 'You don\'t have permission');
            }
            req.user = {user};
            req.session = {authorized: true};
            return res.send({token: createJWT(user)});
        } catch (err) {
            next(err);
        }
    });

    router.post('/passwordRecovery', async (req, res, next) => {
        try {
            const missingFields = validate(req.body, ['username']);
            if (missingFields.length) {
                return res.status(400).send({success: false, missingFields});
            }
            const user = await User.findOne(
                {username: req.body.username},
                {name: 1, surname: 1, email: 1}
            ).lean().exec();
            if (!user) {
                return res.sendStatus(404).send({success: false, userNotFound: true});
            }
            await EmailService.sendTokenToPasswordRecovery(user);
            res.send({success: true});
        } catch (err) {
            next(err);
        }
    });

    router.post('/resetPassword', async (req, res, next) => {
        try {
            if (!req.body.token) {
                return res.sendStatus(403);
            }
            const user = await TokenService.validateToken(req.body.token);
            res.send({user});
        } catch (err) {
            if (err instanceof BusinessError) {
                return res.status(400).send({result: err.message});
            }
            next(err);
        }
    });

    router.post('/resetPassword/:id', async (req, res, next) => {
        try {
            await TokenService.reset(req.body.token, req.body.password);
            res.send({success: true});
        } catch (err) {
            next(err);
        }
    });

    router.post('/externalLogin', async (req, res, next) => {
        try {
            const user = await User.findOne({
                email: req.body.email,
                surname: new RegExp(req.body.surname, 'i'),
                name: new RegExp(req.body.name, 'i')
            }, {password: 0}).populate('roles').lean().exec();
            if (user) {
                req.user = user;
                req.session = {authorized: true};
                return res.send({token: createJWT(user)});
            }
            const rolGuest = await Roles.findOne({name: 'guest'});
            const newUser = {
                email: req.body.email,
                surname: req.body.surname,
                name: req.body.name,
                roles: [rolGuest._id]
            };
            await new User(newUser).save();
            req.user = await User.findOne(
                {username: newUser.username, name: newUser.name, surname: newUser.surname},
                {password: 0}).populate('roles').lean().exec();
            req.session = {authorized: true};
            return res.send({token: createJWT(req.user)});
        } catch (err) {
            next(err);
        }
    });

    return router;
};
