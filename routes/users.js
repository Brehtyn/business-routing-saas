const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditUser, canDeleteUser, canCreateUser, canViewUser} = require('../permissions/userAuth')

//Users index route
router.get('/', checkAuthenticated, authViewUser, async (req, res) =>{
        let user = req.user
        if(!req.timedout){
            res.render('users', {user: user, authorizationLevel: user.authorizationLevel})
        }
})

//Get all users route
router.get('/all', checkAuthenticated, authViewUser, async (req, res) =>{
        let users = []
        const user = req.user
        try{
            users = await User.find().sort({createdAt: 'desc'}).exec()
            console.log(users)
        } catch(err){
            console.log(err)
            users = []
        }
        if(!req.timedout){
            res.render('users/all', {users: users, authorizationLevel: user.authorizationLevel})
        }
})

//New user route page
router.get('/new', checkAuthenticated, authCreateUser, async(req, res) =>{
        try{
            const user = req.user
            if(!req.timedout){
                res.render('users/new',  {user: new User(), authorizationLevel: user.authorizationLevel})
            }
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
        if(!req.timedout){
            res.redirect(`/users/${newUser._id}`)
        }
    }catch(err){
        console.log(err)
        if(!req.timedout){
            res.redirect('/users')
        }
    }
})

//Shows single user page
router.get('/:id', checkAuthenticated, authViewUser, async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!req.timedout){
            res.render('users/show', {user: user, authorizationLevel: user.authorizationLevel})
        }
    }catch{
        if(!req.timedout){
            res.redirect('/users')
        }      
    }
})

//Delete User
router.delete('/delete/:id', checkAuthenticated,authDeleteUser, async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        await user.remove()
        if(!req.timedout){
            res.redirect('/users')
        }
    }catch(err){
        console.log(err)
        if(!req.timedout){
            res.redirect('/users')
        }
    }
})

//Edit user Route
router.get('/edit/:id', checkAuthenticated,authEditUser, async(req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!req.timedout){
            res.render('users/show', {user: user, authorizationLevel: user.authorizationLevel})
        }
    }catch{
        if(!req.timedout){
            res.redirect('/')
        }
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
        if(!req.timedout){
            res.redirect(`/users/${user._id}`)
        }
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