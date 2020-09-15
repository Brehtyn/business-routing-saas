const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        name:{
            type: String,
            require: true
        },
        username:{
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        authorizationLevel: {
            type: Number,
            require: true
        },
        shiftTime: {// DAY, SWING, NIGHT, or CUSTOM
            type: String,
        },
        cell_number: {
            type: String,
            required: true
        },
        send_notifications: {
            type: Boolean
        },
        group: {
            type: String,
            require: true
        }
    })

    module.exports = mongoose.model('User', userSchema)