const mongoose = require('mongoose');

const {Schema} = mongoose;

module.exports = mongoose.model('Password', new Schema({
    _id: {type: String}
}, {collection: 'passwords', timestamps: true}));
