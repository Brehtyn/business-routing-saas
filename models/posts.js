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
        location: {
            type: String,
            require: false
        },
        asset_number: {
            type: Number,
            require: false
        },
        comments:[
            {
                userId: {
                    type: String,
                    require: false
                },
                comment:{
                    type: String,
                    require: false
                }
            }
        ],
        status: {
            type: String
        },
        createdAt:{
            type: Date,
            required: true,
            default: Date.now
        } 
    })

module.exports = mongoose.model('Post', postSchema)