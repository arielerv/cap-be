const {model, Schema} = require('mongoose');

const Career = model('Career', new Schema({
    _id: {type: Number},
    name: {type: String, required: true}
}, {collection: 'careers', timestamps: true}));

module.exports = Career;
