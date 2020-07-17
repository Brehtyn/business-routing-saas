const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
        location: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        telephone_number: {
            type: Number,
            required: true
        },
        tech_service: {
            type: String,
            required: true
        },
        cash_can_access: {
            type: Boolean
        },
        numberOfMachines: {
            type: Number,
        },
        vault: {
            type: String,
        },
       card_printer: {
            type: String,
        },
        front_desk: {
            type: String,
        }
    })

    module.exports = mongoose.model('Buildings', buildingSchema)