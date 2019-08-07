const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    university: {
        type: String
    },

    fieldofstudy: {
        type: String
    },

    location: {
        type: String
    },

    status: {
        type: String,
        required: true
    },

    bio: {
        type: String
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);