const mongoose = require('mongoose')

const machineSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    machineType: {
        type: String
    },
    asset_number: {
        type: String
    },
    ownershipType: {
        type: String
    },
    cabinet_license_number: { 
        type: String
    },
    status: {      //active, pending, posted 
        type: String,
        required: true
    },
    urgent: {
        type: Boolean,
        required: true
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