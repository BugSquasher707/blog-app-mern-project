const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'userModel'
    }
}, {timestamps: true})

module.exports = mongoose.model('postsModel', PostsSchema)