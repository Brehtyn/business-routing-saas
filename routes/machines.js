const express = require('express')
const router = express.Router()
const Building = require('../models/building')
const Machine = require('../models/machine')


//index to create machines
router.get('/', checkAuthenticated, async (req, res) => {
    res.render('machines/createMachIndex')
})

//index to create new machines
router.get('/new',checkAuthenticated,  async(req, res) =>{
    res.render('machines/newmachine', {machine: new Machine()})
})

//creates new machine
router.post('/new', checkAuthenticated,async(req, res) =>{
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
router.get('/remove', checkAuthenticated, (req, res) => {
    var app = req.app;
    const allMachinesArray = (app.get('allMachines'))

    try{
        console.log(allMachinesArray)
        res.render('machines/deleteMachine', {allMachinesArray: allMachinesArray})

    }catch{
        res.redirect('/')
    }
})

router.delete('/remove/:id', checkAuthenticated, async(req, res) =>{
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
            res.redirect('/machines/remove')
        }
    }
})

//to get all machines

router.get('/allmachines', checkAuthenticated,  async( req, res) => {
    var app = req.app
    const allMachinesArray = (app.get('allMachines'))

    try{
        res.render('machines/allmachines', {allMachinesArray: allMachinesArray})
    }catch{
        res.redirect('/')
    }
})

//gets all machines
router.get('/:id', checkAuthenticated, async (req,res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        res.render('machines/index', {machine: machine})
    }catch{
        res.redirect('/')
    }
})

//Edit Building Route
router.get('/edit/:id', checkAuthenticated,  async (req, res) => {
    try{
        const machine = await Machine.findById(req.params.id)
        res.render('machines/edit', {machine: machine})
    }catch {
        res.redirect('/machines')
    }
})

router.put('/edit/:id', checkAuthenticated, async (req, res) => {
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

function checkAuthenticated( req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}


module.exports = router