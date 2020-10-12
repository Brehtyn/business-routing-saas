const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Building = require('../models/building')
const Posts = require('../models/posts')
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
    let postsPending = []
    let postsHolding = []
    //let posts = []
    let buildingsDrop = []
    let day = new Date()
    //console.log(castDay(day))
    try{
    buildings = await Building.find().sort({createdAt: 'desc'}).limit(10).exec()
    //posts = await Posts.find().exec()
    
    postsPending = await Posts.find({status: "PENDING"}, function (err, docs) {
        if(err){
            console.log(err)
        }else{
            console.log("success for pending")
        }
    }).sort({createdAt: 'desc'}).limit(10).exec()

    let postPendingCount = await Posts.countDocuments({status: "PENDING", function (err, result) {
        if(err){
            console.log(err)
        }else{
            console.log("Count:", result)
        }
    }})

    postsHolding = await Posts.find({status: "HOLDING"}, function (err, docs) {
        if(err){
            console.log(err)
        }else{
            console.log("success for holding")
        }
    }).sort({createdAt: 'desc'}).limit(10).exec()

    let postHoldingCount = await Posts.countDocuments({status: "HOLDING", function (err, result) {
        if(err){
            console.log(err)
        }else{
            console.log("Count:" ,result)
        }
    }})

    console.log("Holding Count: " + postHoldingCount)
    console.log("Pendin Count: " + postPendingCount)
    
    let today = castDay(day)
    buildingsDrop = await Building.find({drop_days: today}, function (err, docs) {
        if(err){
            console.log(err)
        }else{
            console.log("success for drop days")
        }
    }).sort({createdAt: 'desc'}).limit(10).exec()

    var user = req.user
     res.render('index', { buildings: buildings, buildingsDrop, user: user, postsPending: postsPending, postsHolding: postsHolding})
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

function castDay(day) {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    return weekday[day.getDay()];
}

module.exports = router