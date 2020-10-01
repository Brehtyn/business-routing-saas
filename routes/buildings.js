const express = require('express')
const router = express.Router()
const Building = require('../models/building');

//index to create buildings
router.get('/', checkAuthenticated, (req, res) => {
    res.render('buildings/index')
})

//page to delete buildings
router.get('/delete', checkAuthenticated, (req, res) => {
    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

    try{
        res.render('buildings/delete', {allBuildingsArray: allBuildingsArray})

    }catch{
        res.redirect('/')
    }
})

//Gets all buildings
router.get('/show', checkAuthenticated, (req, res) => {
    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

    try{
        res.render('buildings/show', {allBuildingsArray: allBuildingsArray})

    }catch{
        res.redirect('/')
    }
})

//New Machine Route, just the form for making a new machine
router.get('/new',checkAuthenticated, async (req,res) => {
    res.render('buildings/new', {building: new Building()})
})

// //creates the machine by sending it to the database
router.post('/new',checkAuthenticated , async (req,res) => {
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


//Fix this route and find better name than indexHome but first get all shit working
//Probably will get fixed in the views instead of on here but we shall see
router.get('/:id', checkAuthenticated, async (req,res) => {
    var app = req.app;
    const allMachinesArray = (app.get('allMachines'))

    try{
        const building = await Building.findById(req.params.id)
        res.render('indexBuildings', {building: building, allMachinesArray: allMachinesArray})
    }catch{
        res.redirect('/')
    }
})

router.delete('/delete/:id', checkAuthenticated, async(req, res) =>{
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
            res.redirect('/buildings/delete')
        }
    }
})

//Edit Building Route
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    try{
        const building = await Building.findById(req.params.id)
        res.render('buildings/edit', {building: building})
    }catch {
        res.redirect('/buildings')
    }
})

router.put('/edit/:id',checkAuthenticated, async (req, res) => {
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

function checkAuthenticated( req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router