const mongoose = require('mongoose')
const Post = require('./posts').schema

const historySchema = new mongoose.Schema({
        post: [Post],
    
        createdAt:{
            type: Date,
            required: true,
            default: Date.now
    } 
})

    module.exports = mongoose.model('History', historySchema)