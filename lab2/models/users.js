const { Schema, model } = require('mongoose');

const schema = new Schema({
 email: { type: String, required: true, unique: true },
 password: { type: String },
 apiKey: { type: String, required: true, unique: true }
});

const Users = new model('users', schema, 'users');

module.exports = { Users };