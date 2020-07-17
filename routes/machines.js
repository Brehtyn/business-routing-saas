const express = require('express')
const router = express.Router()
const Building = require('../models/building')
const Machine = require('../models/machine')


router.get('/:id', async (req,res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        res.render('machines/index', {machine: machine})
    }catch{
        res.redirect('/')
    }
})

module.exports = router