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
            city: req.body.city,
            location: req.body.location,
            status: req.body.status,
            urgent: req.body.urgent,
            createdAt: new Date(req.body.createdAt)
        })

        const newMachine = await machine.save()
        console.log(newMachine)

    }catch(err){
        console.log(err)
    }
})

//to delete a machine
router.get('/delete', checkAuthenticated, authDeleteProject, (req, res) => {
    var app = req.app;
    const allMachinesArray = (app.get('allMachines'))

    try{
        console.log(allMachinesArray)
        res.render('machines/deleteMachine', {allMachinesArray: allMachinesArray})

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
    var app = req.app
    const allMachinesArray = (app.get('allMachines'))

    try{
        res.render('machines/show', {allMachinesArray: allMachinesArray})
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
        machine.status = req.body.status,
        machine.urgent = req.body.urgent,
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