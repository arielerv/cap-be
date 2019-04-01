const {model, Schema} = require('mongoose');

module.exports = model('Roles', new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
}, {collection: 'roles', timestamps: true}));
