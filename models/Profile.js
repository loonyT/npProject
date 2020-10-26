const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        //special field type which is an object id were connecting it to an id in the user model 
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: // junior web dev, senior ....
    {
        type: String
    },
    skills: //is gonna be an array of string
    {
        type: {
            String
        }
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },

    experience: [

        {

            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }

        }
    ],

    education: [

        {

            school: {
                type: String,
                required true
            }
            degree: {
                type: String,
                required true
            }
            fieldofstudy: {
                type: String,
                required true
            }
            from: {
                type: Date,
                required true
            },
            to: {
                type: Date,
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
            },

        }
    ],

    social: {

        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }

    },

    date: {

        type: Date,
        default: Date.now

    }

});

// exporting the profile field : 

module.exports = Profile = mongoose.model('profile', ProfileSchema);