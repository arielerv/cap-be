const {Password} = require('../model');
const {head, sampleSize} = require('lodash');

class PasswordGeneralService {
    /**
     * Generates a password with random chars.
     * @param {Number} length The length of the password to generate.
     * @returns {String} Returns a password made of random chars.
     */
    static generate(length = 12) {
        return sampleSize('abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890', length).join('');
    }

    /**
     * Fetch one random password from the simple passwords collection
     * @returns {Promise<String>} Returns a simple password.
     */
    static async fetchOne() {
        const {_id} = head(await Password.aggregate([{$sample: {size: 1}}]).exec());
        return _id;
    }
}

module.exports = PasswordGeneralService;
