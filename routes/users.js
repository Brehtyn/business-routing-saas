const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditUser, canDeleteUser, canCreateUser, canViewUser} = require('../permissions/userAuth')

//Users index route
router.get('/', checkAuthenticated, authViewUser, async (req, res) =>{
    let user = req.user
    res.render('users', {user: user})
})

//Get all users route
router.get('/all', checkAuthenticated, authViewUser, async (req, res) =>{
    let users = []
    try{
        users = await User.find().sort({createdAt: 'desc'}).exec()
        console.log(users)
    } catch(err){
        console.log(err)
        users = []
    }
    res.render('users/all', {users: users})
})

//New user route page
router.get('/new', checkAuthenticated, authCreateUser, async(req, res) =>{
    try{
    res.render('users/new',  {user: new User()})
    }catch(err){
        console.log(err)
    }
})

//New user Route
router.post('/new', checkAuthenticated, authCreateUser, async(req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            authorizationLevel: req.body.authorizationLevel,
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
router.get('/:id', checkAuthenticated, authViewUser, async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('users/show', {user: user})
    }catch{
        res.redirect('/users')
    }
})

//Delete User
router.delete('/delete/:id', checkAuthenticated,authDeleteUser, async(req, res) => {
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
router.get('/edit/:id', checkAuthenticated,authEditUser, async(req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('users/show', {user: user})
    }catch{
        res.redirect('/')
    }
})

//Edit user Route
router.post('/edit/:id', checkAuthenticated,authEditUser, async(req, res) =>{
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

//checks if user is authorized to edit project
function authEditUser(req, res, next) {
    if(!canEditUser(req.user)){
        res.redirect('/users')
        return res.end()
    }
    next()
}

function authCreateUser(req, res, next) {
    if(!canCreateUser(req.user)){
        res.redirect('/users')
        return res.end()
    }
    next()
}

function authDeleteUser(req, res, next) {
    if(!canDeleteUser(req.user)){
        res.redirect('/users')
        return res.end()
    }
    next()
}

function authViewUser(req, res, next) {
    if(!canViewUser(req.user)){
        res.redirect('/')
        return res.end()
    }
    next()
}

module.exports = router