const {validate} = global.app.validation;
const {split} = require('lodash');

const {EmailClient} = require('../model');
const logger = require('../toolkit/logger');
const email = require('../services/email');

const authenticate = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        return res.sendStatus(401);
    }
    const token = split(header, /\s+/).pop();
    if (!token) {
        return res.sendStatus(401);
    }
    const auth = split(new Buffer(token, 'base64').toString(), /:/);
    if (!auth.length) {
        logger.info('not auth');
        return res.sendStatus(401);
    }
    EmailClient.findOne({
        _id: auth[0],
        password: auth[1],
        disabled: {$ne: true}
    }).exec().then(
        user => {
            if (!user) {
                return res.sendStatus(401);
            }
            req.user = user;
            return next();
        }
    ).catch(
        err => next(Error.create('An error occurred trying to authenticate the mobile user.', {_id: auth[0]}, err))
    );
};

module.exports = router => {
    router.post('/', authenticate, (req, res, next) => {
        const missingFields = validate.required(req.body, ['to', 'subject', 'message']);
        if (missingFields.length) {
            return res.status(400).send({missingFields});
        }
        email.send(req.body.to, req.body.subject, req.body.message).then(
            () => res.send({success: true})
        ).catch(next);
    });

    return router;
};
