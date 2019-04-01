const crypto = require('crypto');

module.exports = {
    hash: (input, encoding) => crypto.createHash('sha256').update(input).digest(encoding || 'base64'),
    encrypt: (input, encoding) => {
        encoding = encoding || 'base64';
        const cipher = crypto.createCipheriv('aes-256-cbc', '0xMY085p7KD0Kf7siepi26OPFYLWnX9t', '077NLgyjM9Me3K5d');
        return cipher.update(input, 'utf8', encoding) + cipher.final(encoding);
    },
    decrypt: (input, encoding) => {
        encoding = encoding || 'base64';
        const decipher = crypto.createDecipheriv('aes-256-cbc', '0xMY085p7KD0Kf7siepi26OPFYLWnX9t', '077NLgyjM9Me3K5d');
        return decipher.update(input, encoding, 'utf8') + decipher.final('utf8');
    }
};
