const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Building = require('../models/building')
const passport = require('passport')
const initializePassport = require('../public/passport-config')
const flash = require('express-flash')
const { checkAuthenticated } = require('../permissions/basicAuth')

initializePassport(
    passport,
    async username => {await User.findOne({username: username})},
    async id => {await User.findById(id)}
)

//index router page
router.get('/', checkAuthenticated, async (req, res) => {
    let buildings = []
    try{
    buildings = await Building.find().sort({createdAt: 'desc'}).limit(10).exec()
    var user = req.user
     res.render('index', { buildings: buildings, user: user})
    }catch{
        res.redirect('/login')
    }
})

//logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      req.logOut();
      res.clearCookie('graphNodeCookie');
      res.status(200);
      res.redirect('/login');
    });
  });

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect:'/login',
    failureFlash: true}), async (req, res) => {
        if(req.isAuthenticated() === true){
            try{
                req.logIn(req.user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('/');
                  });
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

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

module.exports = router