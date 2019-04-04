const {model, Schema} = require('mongoose');

const Zone = model('Zone', new Schema({
    _id: {type: Number},
    name: {type: String, required: true},
    state: {type: Number, required: true},
    departments: [{type: Number, required: true}]
}, {collection: 'zones', timestamps: true}));

module.exports = Zone;
