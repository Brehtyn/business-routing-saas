const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//Users index route
router.get('/', async (req, res) =>{
    res.render('users/index')
})

//Get all users route
router.get('/all', async (req, res) =>{
    let users = []
    try{
        users = await User.find().sort({createdAt: 'desc'}).limit(10).exec()
        console.log(users)
    } catch(err){
        console.log(err)
        users = []
    }
    res.render('users/all', {users: users})
})

//New user route page
router.get('/new', async(req, res) =>{
    try{
    res.render('users/new',  {user: new User()})
    }catch(err){
        console.log(err)
    }
})

//New user Route
router.post('/new', async(req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            authorzationLevel: req.body.authorzationLevel,
            cell_number: req.body.cell_number,
            group: req.body.group
        })

        const newUser = await user.save()
        res.redirect(`/users/${newUser._id}`)
    }catch(err){
        console.log(err)
        res.redirect('/users')
    }
})

//Shows single user page
router.get('/:id', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('users/show', {user: user})
    }catch{
        res.redirect('/users')
    }
})

//Delete User
router.delete('/delete/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users')
    }catch(err){
        console.log(err)
        res.redirect('/users')
    }
})

//Edit user Route
router.get('/edit/:id', async(req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('users/show', {user: user})
    }catch{
        res.redirect('/')
    }
})

//Edit user Route
router.post('/edit/:id', async(req, res) =>{
    try{
        const user = await User.findById(req.params.id)
            user.name =  req.body.name,
            user.username = req.body.username,
            user.password =  req.body.password,
            user.authorizationLevel = req.body.authorzationLevel,
            user.cell_number = req.body.cell_number,
            user.group = req.body.group

        await user.save()
        res.redirect(`/users/${user._id}`)

    }catch(err){
        console.log(err)
    }
})

module.exports = router