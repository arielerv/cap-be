const querystring = require('querystring');

const {BusinessError, User} = require('../model');
const CryptoService = require('../services/crypto');

const TOKEN_TYPE = 'passRecover';
const TOKEN_TTL = 30 * 60 * 1000;

class TokenService {
    static validateToken(token) {
        const data = JSON.parse(CryptoService.decrypt(querystring.unescape(token)));
        const timestamp = new Date(data.timestamp);
        if (data.type !== TOKEN_TYPE || !data.timestamp || !timestamp.getTime()) {
            throw new BusinessError('invalidToken');
        }
        if (new Date() - timestamp > TOKEN_TTL) {
            throw new BusinessError('tokenExpired');
        }
        return User.findById(data.user, {name: 1, surname: 1, email: 1}).exec();
    };

    static async reset(token, password) {
        const user = await TokenService.validateToken(token);
        user.password = CryptoService.hash(password);
        return user.save();
    }
}

module.exports = TokenService;
