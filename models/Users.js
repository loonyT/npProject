const mongoose = require('mongoose');
//takes an object with all fields we want
const UserSchema = new mongoose.Schema({

    name: {

        type: String,
        required: true
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

    avatar: {
        type: String
    },

    date: { //juste creating a date 

        type: Date,
        default: Date.now
    }

    // gravatar allow to atach an avatar to an email 
    // will create a user but not a profile 
    //the avatar must be availaible right away tho 
});

module.exports = User = mongoose.model('user', UserSchema);