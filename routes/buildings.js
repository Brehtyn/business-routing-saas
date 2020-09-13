const express = require('express')
const router = express.Router()
const Building = require('../models/building');

//index to create buildings
router.get('/', (req, res) => {
    res.render('buildings/createindex')
})

//page to delete buildings
router.get('/remove', (req, res) => {
    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

    try{
        console.log(allBuildingsArray)
        res.render('buildings/deleteBuilding', {allBuildingsArray: allBuildingsArray})

    }catch{
        res.redirect('/')
    }
})

//Gets all buildings
router.get('/allbuildings', (req, res) => {
    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

    try{
        res.render('buildings/allbuildings', {allBuildingsArray: allBuildingsArray})

    }catch{
        res.redirect('/')
    }
})

//New Machine Route, just the form for making a new machine
router.get('/new',async (req,res) => {
    res.render('buildings/new', {building: new Building()})
})

// //creates the machine by sending it to the database
router.post('/new', async (req,res) => {
    try{
        const building = new Building({
            location: req.body.location,
            address: req.body.address,
            telephone_number: req.body.telephone_number,
            tech_service: req.body.tech_service
        })

        const newBuilding = await building.save()
        console.log(newBuilding)
        //res.redirect(`buildings/${newBuilding.id}`)
    }catch(err){
        console.log(err)
    }
})

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

router.delete('/remove/:id', async(req, res) =>{
    try{
        const building = await Building.findById(req.params.id)
        await building.remove()
        res.redirect('/buildings')
    } catch {
        if(building == null){
            res.redirect('/')
        }
        else{
            console.log('could not remove book')
            res.redirect('/buildings/remove')
        }
    }
})

//Edit Building Route
router.get('/edit/:id', async (req, res) => {
    try{
        const building = await Building.findById(req.params.id)
        res.render('buildings/edit', {building: building})
    }catch {
        res.redirect('/buildings')
    }
})

router.put('/edit/:id',async (req, res) => {
    try{
        const building = await Building.findById(req.params.id)
        building.location = req.body.location,
        building.address = req.body.address,
        building.telephone_number = req.body.telephone_number,
        building.tech_service = req.body.tech_service
        await building.save()
        res.redirect(`/buildings/${building._id}`)
    } catch{
        res.redirect('/buildings')
    }
})

module.exports = router