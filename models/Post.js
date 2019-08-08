const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    // ref connects user to the post, shows who created
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    course: {
        type: String
    },
    description: {
        type: String
    },
    //name(user) & avatar allows you to show name and avatar easily within the post
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Post = mongoose.model('post', PostSchema);