const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const initializePassport = require('../public/passport-config')
const flash = require('express-flash')

initializePassport(
    passport,
    async username => {await User.findOne({username: username})},
    async id => {await User.findById(id)}
)

//index router page
router.get('/', checkAuthenticated,(req, res) => {
    try{
    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

     res.render('index', { allBuildingsArray: allBuildingsArray })
    }catch{
        res.redirect('/login')
    }
})

//logout
router.delete('/logout', (res, req) =>{
    req.logOut();
    res.redirect('/login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect:'/login',
    failureFlash: true}), async (req, res) => {
        if(req.isAuthenticated() === true){
            try{
                const user = await User.findOne({username: req.body.username})
                res.redirect('/')
            }catch{
                res.redirect('/login')
            }
        }
        if(req.isAuthenticated() === false){
            res.redirect('/login')
        }
    })

//login page
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

function checkAuthenticated( req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

module.exports = router