const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: [
            {
                type: Object,
            }
        ],
        default: [
            {
                "user": 2001
            }
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', UserSchema)

module.exports = User;