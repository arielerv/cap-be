const {every} = require('lodash');
const mongoose = require('mongoose');

const pkg = require('../../package');

class StatusService {
    static getStatus() {
        const deps = [StatusService.getMongoDBStatus()];
        return {
            name: pkg.name,
            status: every(deps, dep => dep.status === 'ok') ? 'ok' : 'down',
            deps
        };
    }

    static getMongoDBStatus() {
        const connected = mongoose.connection.readyState === 1;
        return {name: 'MongoDB', status: connected ? 'ok' : 'down'};
    }
}

module.exports = StatusService;
