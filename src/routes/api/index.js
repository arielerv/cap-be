const {Router} = require('express');
const requireDir = require('require-dir');
const {forEach} = require('lodash');

const logger = require('../../helpers/logger');

module.exports = router => {
    forEach(
        requireDir('.', {recurse: true}),
        (module, name) => {
            logger.info(`Loading ${name} api...`);
            router.use(`/${name}`, module(Router()));
        }
    );

    return router;
};
