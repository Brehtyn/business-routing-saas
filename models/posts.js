const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
        post:{
            type: String,
            require: true
        },
        createdBy: {
            type: String,
            require: true
        },
        comments:[
            {
                user_id: {
                    type: String,
                    require: false
                },
                comment:{
                    type: String,
                    require: false
                }
            }
        ],
        createdAt:{
            type: Date,
            required: true,
            default: Date.now
        } 
    })

module.exports = mongoose.model('Post', postSchema)