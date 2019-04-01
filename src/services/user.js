const {ObjectId} = require('mongoose').Types;
const {User} = require('../model');
const crypto = require('./crypto');
const PasswordService = require('./passwordGenerator');
const EmailService = require('./email');

class UserService {
    static fetch() {
        return User.find({disabled: {$ne: true}}, {password: 0}).sort({_id: -1}).limit(25).lean().exec();
    }

    static update(userId, user) {
        return User.findOneAndUpdate({_id: ObjectId(userId)}, user).exec();
    }

    static async create(user) {
        const userIn = new User(user);
        if (user.typePassword === 1) {
            const textPassword = await PasswordService.fetchOne();
            userIn.password = crypto.hash(textPassword);
            await EmailService.sendCredentials(user, textPassword);
            return userIn.save();
        }
        if(user.typePassword === 2) {
            userIn.password = crypto.hash(user.password);
            await EmailService.sendCredentials(user, user.password);
            return userIn.save();
        }
        await userIn.save();
        const us = await User.findOne({username: userIn.username, name: userIn.name, surname: userIn.surname}, {name: 1, surname: 1, email: 1});
        return await EmailService.sendTokenToNewPassword(us);
    }

    static remove(userId) {
        return User.findOneAndUpdate({_id: ObjectId(userId)}, {disabled: true}).exec();
    }

    static find(userId) {
        return User.findById(userId, {password: 0}).lean().exec();
    }
}

module.exports = UserService;
