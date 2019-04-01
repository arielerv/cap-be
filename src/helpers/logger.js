const winston = require('winston');
require('winston-mongodb');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});
