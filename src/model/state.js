const {model, Schema} = require('mongoose');

const State = model('State', new Schema({
    _id: {type: Number},
    name: {type: String},
    departments: [{
        _id: {type: Number},
        name: {type: String}
    }]
}, {collection: 'states', timestamps: true}));

module.exports = State;
