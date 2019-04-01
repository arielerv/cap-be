const {includes, castArray, some} = require('lodash');

const permissionMiddleware = roles =>
    (req, res, next) => {
        if (!roles || !some(req.user.roles, rol => includes(castArray(roles), rol.name))) {
            return res.status(403).send({message: 'You don\'t have permission to perform this action.'});
        }
        next();
    };

module.exports = permissionMiddleware;
