const express = require('express')
const router = express.Router()
const Building = require('../models/building')
const Machine = require('../models/machine')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditMachine, canDeleteMachine, canCreateMachine} = require('../permissions/machineAuth')

//index to create machines
router.get('/', checkAuthenticated, async (req, res) => {
    if(!req.timedout){
        const user = req.user
        res.render('machines/index', {authorizationLevel: user.authorizationLevel})
    }
})

//index to create new machines
router.get('/new',checkAuthenticated, authCreateProject,  async(req, res) =>{
    if(!req.timedout){
        const user = req.user
        res.render('machines/new', {machine: new Machine(), authorizationLevel: user.authorizationLevel})
    }
})

//creates new machine
router.post('/new', checkAuthenticated, authCreateProject, async(req, res) =>{
        try{
            const machine = new Machine({
                location: req.body.location,
                machine_model: req.body.machine_model,
                asset_number: req.body.asset_number,
                status: req.body.status,
                urgent: req.body.urgent,
                ownershipType: req.body.ownershipType,
                cabinet_license_number: req.body.cabinet_license_number,
                datasheet: req.body.datasheet,
                description: req.body.description,
                createdAt: new Date(req.body.createdAt)
            })
    
            const newMachine = await machine.save()
            if (!req.timedout) { 
                res.redirect(`/machines/${newMachine._id}`)
            }
        }catch(err){
            console.log(err)
        }
})

//to delete a machine
router.get('/delete', checkAuthenticated, authDeleteProject,async  (req, res) => {
        let machines = []
        const user = req.user
        try{
            machines = await Machine.find().sort({createdAt: 'desc'}).exec()
            if (!req.timedout) { 
                res.render('machines/delete', {machines: machines, authorizationLevel: user.authorizationLevel})
            }
    
        }catch{
            if (!req.timedout) { 
                res.redirect('/')
            }
        }
})

router.delete('/delete/:id', checkAuthenticated, authDeleteProject, async(req, res) =>{
        try{
            const machine = await Machine.findById(req.params.id)
            await machine.remove()
            if (!req.timedout) { 
                res.redirect('/machines')
            }
        } catch {
            if(machine == null){
                if (!req.timedout) { 
                    res.redirect('/')
                }
            }
            else{
                if (!req.timedout) { 
                    res.redirect('/machines/delete')
                }
            }
        }
})

//to get all machines

router.get('/show', checkAuthenticated,  async( req, res) => {
        let machines = []
        const user = req.user
        try{
            machines = await Machine.find().sort({createdAt: 'desc'}).exec()
            if (!req.timedout) { 
                res.render('machines/show', {machines: machines, authorizationLevel: user.authorizationLevel})
            }
        }catch{
            if (!req.timedout) { 
                res.redirect('/')
            }
        }
})

//gets all machines
//Have to fix this route eventually with indexMachines
//Will probably make this new index once project expands
router.get('/:id', checkAuthenticated, async (req,res) => {
        try{
            const user = req.user
            const machine = await Machine.findById(req.params.id)
            if(!req.timedout){
                res.render('indexMachines', {machine: machine, authorizationLevel: user.authorizationLevel})
            }
        }catch{
            if (!req.timedout) { 
                res.redirect('/')
            }
        }
})

//Edit Building Route
router.get('/edit/:id', checkAuthenticated, authEditProject, async (req, res) => {
        try{
            const machine = await Machine.findById(req.params.id)
            const user = req.user
            if (!req.timedout) { 
                res.render('machines/edit', {machine: machine, authorizationLevel: user.authorizationLevel})
            }
        }catch {
            if (!req.timedout) { 
                res.redirect('/machines') 
            }
        }
})

router.put('/edit/:id', checkAuthenticated, authEditProject, async (req, res) => {
        try{
            const machine = await Machine.findById(req.params.id)
            machine.city = req.body.city,
            machine.location = req.body.location,
            machine.asset_number = req.body.asset_number,
            machine.machine_model = req.body.machine_model,
            machine.status = machine.status,
            machine.urgent = machine.urgent,
            machine.ownershipType = req.body.ownershipType,
            machine.cabinet_license_number = req.body.cabinet_license_number,
            machine.datasheet = req.body.datasheet,
            machine.description = req.body.description,
            createdAt = new Date(req.body.createdAt)
            await machine.save()
            if (!req.timedout) { 
                res.redirect(`/machines/${machine._id}`)
            }
        } catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/machines')
            }
        }
})

//checks if user is authorized to edit project
function authEditProject(req, res, next) {
    if(!canEditMachine(req.user)){
        res.redirect('/machines')
        return res.end()
    }
    next()
}

function authCreateProject(req, res, next) {
    if(!canCreateMachine(req.user)){
        res.redirect('/machines')
        return res.end()
    }
    next()
}

function authDeleteProject(req, res, next) {
    if(!canDeleteMachine(req.user)){
        res.redirect('/machines')
        return res.end()
    }
    next()
}





module.exports = router