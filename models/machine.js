const mongoose = require('mongoose')

const machineSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    machine_model: {
        type: String,
        required: true
    },
    asset_number: {
        type: String,
        required: true
    },
    ownershipType: {
        type: String,
        required: false
    },
    cabinet_license_number: { 
        type: String
    },
    status: {      //WORKING, PENDING, HOLDING only
        type: String,
        required: true,
        default:"WORKING"
    },
    urgent: {
        type: Boolean,
        default: false,
        required: true
    },
    datasheet: {
        type: String,
        required: false,
        default:"default"
    },
    description: {
        type: String    
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Machine', machineSchema)