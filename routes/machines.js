const express = require('express')
const router = express.Router()
const Building = require('../models/building')
const Machine = require('../models/machine')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditMachine, canDeleteMachine, canCreateMachine} = require('../permissions/machineAuth')

//index to create machines
router.get('/', checkAuthenticated, async (req, res) => {
    res.render('machines/index')
})

//index to create new machines
router.get('/new',checkAuthenticated, authCreateProject,  async(req, res) =>{
    res.render('machines/new', {machine: new Machine()})
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
        res.redirect(`/machines/${newMachine._id}`)

    }catch(err){
        console.log(err)
    }
})

//to delete a machine
router.get('/delete', checkAuthenticated, authDeleteProject,async  (req, res) => {
    let machines = []

    try{
        machines = await Machine.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('machines/deleteMachine', {machines: machines})

    }catch{
        res.redirect('/')
    }
})

router.delete('/delete/:id', checkAuthenticated, authDeleteProject, async(req, res) =>{
    try{
        const machine = await Machine.findById(req.params.id)
        await machine.remove()
        res.redirect('/machines')
    } catch {
        if(machine == null){
            res.redirect('/')
        }
        else{
            console.log('could not remove book')
            res.redirect('/machines/delete')
        }
    }
})

//to get all machines

router.get('/show', checkAuthenticated,  async( req, res) => {
    let machines = []
    try{
        machines = await Machine.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('machines/show', {machines: machines})
    }catch{
        res.redirect('/')
    }
})

//gets all machines
//Have to fix this route eventually with indexMachines
//Will probably make this new index once project expands
router.get('/:id', checkAuthenticated, async (req,res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        res.render('indexMachines', {machine: machine})
    }catch{
        res.redirect('/')
    }
})

//Edit Building Route
router.get('/edit/:id', checkAuthenticated, authEditProject, async (req, res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        res.render('machines/edit', {machine: machine})
    }catch {
        res.redirect('/machines')
    }
})

router.put('/edit/:id', checkAuthenticated, authEditProject, async (req, res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        machine.city = req.body.city,
        machine.location = req.body.location,
        machine.asset_number = req.body.asset_number,
        machine.machine_model = req.body.machine_model,
        machine.status = req.body.status,
        machine.urgent = req.body.urgent,
        machine.ownershipType = req.body.ownershipType,
        machine.cabinet_license_number = req.body.cabinet_license_number,
        machine.datasheet = req.body.datasheet,
        machine.description = req.body.description,
        createdAt = new Date(req.body.createdAt)
        await machine.save()
        res.redirect(`/machines/${machine._id}`)
    } catch{
        res.redirect('/machines')
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