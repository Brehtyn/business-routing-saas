const express = require('express')
const router = express.Router()
const Building = require('../models/building');

//Gets all machines
// router.get('/', (req, res) => {
//     res.render('buildings/index')
// })

// //New Machine Route, just the form for making a new machine
// router.get('/new', (req,res) => {
//     res.render('buildings/new', { building: new Building() })
// })

// //creates the machine by sending it to the database
// router.post('/', (req,res) => {
//     res.send('Create')
// })

router.get('/:id', async (req,res) => {
    var app = req.app;
    const allMachinesArray = (app.get('allMachines'))

    try{
        const building = await Building.findById(req.params.id)
        res.render('buildings/index', {building: building, allMachinesArray: allMachinesArray})
    }catch{
        res.redirect('/')
    }
})

module.exports = router