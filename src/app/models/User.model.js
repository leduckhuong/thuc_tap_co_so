const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    account: { type: String, required: true, unique: true, minLenght: 6 },
    password: { type: String, required: true, minLenght:6 }
});

module.exports = mongoose.model('User', UserSchema);