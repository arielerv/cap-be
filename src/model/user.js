const {model, Schema} = require('mongoose');

module.exports = model('User', new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    documentId: {type: Number},
    disabled: {type: Boolean},
    roles: [{type: String, required: true, ref: 'Roles'}],
    birthday: {type: Date},
    state: {type: String},
    telephone: {type: String}
}, {collection: 'users', timestamps: true}));
