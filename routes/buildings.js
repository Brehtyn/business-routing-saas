const express = require('express')
const router = express.Router()
const Building = require('../models/building');
const Machine = require('../models/machine')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditBuilding, canDeleteBuilding, canCreateBuilding} = require('../permissions/buildingAuth')
//index to create buildings
router.get('/', checkAuthenticated, (req, res) => {
    const user = req.user
    if(!req.timedout){
        res.render('buildings/index', {authorizationLevel: user.authorizationLevel})
    }
})

//page to delete buildings
router.get('/delete', checkAuthenticated, authDeleteLocation, async (req, res) => {
        let buildings = []
        const user = req.user
        try{
            buildings = await Building.find().sort({createdAt: 'desc'}).exec()
            if(!req.timedout){
                res.render('buildings/delete', {buildings: buildings, authorizationLevel: user.authorizationLevel})
            }
        }catch{
            if(!req.timedout){
                res.redirect('/')
            }
        }
})

//Gets all buildings
router.get('/show', checkAuthenticated, async (req, res) => {
        let buildings = []
        const user = req.user
        try{
            buildings = await Building.find().sort({createdAt: 'desc'}).exec()
            if (!req.timedout) { 
                res.render('buildings/show', {buildings: buildings, authorizationLevel: user.authorizationLevel})               
            }
    
        }catch{
            if (!req.timedout) { 
                res.redirect('/')                
            }
        }
})

//New Machine Route, just the form for making a new machine
router.get('/new',checkAuthenticated, authCreateLocation, async (req,res) => {
    const user = req.user
    if(!req.timedout){
        res.render('buildings/new', {building: new Building(), authorizationLevel: user.authorizationLevel})
    }
})

// //creates the machine by sending it to the database
router.post('/new',checkAuthenticated, authCreateLocation, async (req,res) => {
        let drop_days = { Monday: req.body.monday, 
            Tuesday: req.body.tuesday,
            Wednesday: req.body.wednesday,
            Thursday: req.body.thursday,
            Friday: req.body.friday }
        try{
        const building = new Building({
            location: req.body.location,
            short_name: req.body.short_name,
            address: req.body.address,
            building_type: req.body.building_type,
            telephone_number: req.body.telephone_number,
            tech_service: req.body.tech_service,
            cash_can_access: req.body.cash_can_access,
            drop_days: drop_days
        })

        const newBuilding = await building.save()
        if (!req.timedout) { 
            res.redirect(`${newBuilding.id}`)    
        }
        }catch(err){
        console.log(err)
        }
})


//Fix this route and find better name than indexHome but first get all shit working
//Probably will get fixed in the views instead of on here but we shall see
router.get('/:id', checkAuthenticated, async (req,res) => {
        let machines = []
        const user = req.user
        try{
            const building = await Building.findById(req.params.id)
            const location = building.location
            machines = await Machine.find({location: location}, function (err, docs) {
                if(err){
                    console.log(err)
                }else{
                    console.log("First function call : ", docs)
                }
            }).sort({createdAt: 'desc'}).limit(10).exec()

            if (!req.timedout) { 
                res.render('indexBuildings', {building: building, machines: machines, authorizationLevel: user.authorizationLevel})                
            }
        }catch{
            if (!req.timedout) { 
                res.redirect('/')                
            }
        }
})

router.delete('/delete/:id', checkAuthenticated, authDeleteLocation, async(req, res) =>{
        try{
            const building = await Building.findById(req.params.id)
            await building.remove()
            res.redirect('/buildings')
        } catch {
            if(building == null){
                if (!req.timedout) { 
                    res.redirect('/')      
                }
            }
            else{
                if (!req.timedout) { 
                    res.redirect('/buildings/delete')
                }
            }
        }
})

router.get('/location/:location',checkAuthenticated, async (req, res) => {
    var buildinglocation = req.params.location
    try{
        //works for findone bc returns object not object array
        const building = await Building.findOne({location: buildinglocation})
        console.log(building)
        res.redirect(`/buildings/${building._id}`)
    }catch(err){
        res.redirect('/buildings')
    }
})

//Edit Building Route
router.get('/edit/:id', checkAuthenticated, authEditLocation, async (req, res) => {
        try{
            const user = req.user
            const building = await Building.findById(req.params.id)
            if (!req.timedout) { 
                res.render('buildings/edit', {building: building, authorizationLevel: user.authorizationLevel})
            }
        }catch {
            if (!req.timedout) { 
                res.redirect('/buildings')   
            }
        }
})

router.put('/edit/:id',checkAuthenticated, authEditLocation, async (req, res) => {
        let drop_days = { Monday: req.body.monday, 
            Tuesday: req.body.tuesday,
            Wednesday: req.body.wednesday,
            Thursday: req.body.thursday,
            Friday: req.body.friday }
        try{
            const building = await Building.findById(req.params.id)
            building.location = req.body.location,
            building.address = req.body.address,
            building.short_name = req.body.short_name,
            building.building_type = req.body.building_type,
            building.telephone_number = req.body.telephone_number,
            building.tech_service = req.body.tech_service,
            building.front_desk = req.body.front_desk,
            building.numberOfMachines = req.body.numberOfMachines,
            building.cash_can_access = req.body.cash_can_access,
            building.vault = req.body.vault,
            building.card_printer = req.body.card_printer
            building.drop_days = drop_days
            await building.save()
            if (!req.timedout) { 
                res.redirect(`/buildings/${building._id}`)
            }
        } catch{
            if (!req.timedout) { 
                res.redirect('/buildings')  
            }
        }
})

//checks if user is authorized to edit project
function authEditLocation(req, res, next) {
    if(!canEditBuilding(req.user)){
        res.redirect('/buildings')
        return res.end()
    }
    next()
}

function authCreateLocation(req, res, next) {
    if(!canCreateBuilding(req.user)){
        res.redirect('/buildings')
        return res.end()
    }
    next()
}

function authDeleteLocation(req, res, next) {
    if(!canDeleteBuilding(req.user)){
        res.redirect('/buildings')
        return res.end()
    }
    next()
}


module.exports = router