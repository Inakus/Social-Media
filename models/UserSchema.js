const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    date: { 
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;