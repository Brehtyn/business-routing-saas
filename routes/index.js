const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Building = require('../models/building')
const Posts = require('../models/posts')
const passport = require('passport')
const initializePassport = require('../public/passport-config')
const flash = require('express-flash')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { create } = require('../models/posts')
const timeout = require('connect-timeout')

initializePassport(
    passport,
    async username => {await User.findOne({username: username})},
    async id => {await User.findById(id)}
)

//index router page
router.get('/', checkAuthenticated,async (req, res) => {
    let postsPending = []
    let postsHolding = []
    let buildingsDrop = []
    let buildings = []
    let day = new Date()
    try{
    let today = castDay(day)
    console.log(today)
    //used buildings and then wrote over it down below
    buildings = await Building.find({}).sort({createdAt: 'desc'}).exec()
    postsPending = await Posts.find({status: "PENDING"}, function (err, docs) {
        if(err){
            console.log(err)
        }else{
            console.log("success for pending")
        }
    }).sort({createdAt: 'desc'}).exec()

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
    }).sort({createdAt: 'desc'}).exec()

    let postHoldingCount = await Posts.countDocuments({status: "HOLDING", function (err, result) {
        if(err){
            console.log(err)
        }else{
            console.log("Count:" ,result)
        }
    }})

    buildings = await Building.find({})
        buildings.forEach(building => {
            building.drop_days.forEach(dropdayobj => {
                if(dropdayobj[`${today}`]){
                    buildingsDrop.push(building)
                }
            })
        });


    var user = req.user
    if (!req.timedout) { 
        res.render('index', { buildings: buildings, buildingsDrop, user: user, postsPending: postsPending, postsHolding: postsHolding, url:'/', postHoldingCount: postHoldingCount, postPendingCount: postPendingCount })
    }
    }catch{
        //Making this catch block redirect to the login page gives an error because it never logs the user out
        //so the user is still authenticated which would redirect it back to the home page in turn redirecting back
        //out to the login page and thereby making an infinite loop
        console.log('There was an error renderin the page')
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
    failureFlash: true}), 
    async (req, res) => {
        if(req.isAuthenticated() === true){
            try{
                req.logIn(req.user, function(err) {
                    if (err) { 
                        console.log(err)
                        return next(err); }
                    return res.redirect('/');
                  });
            }catch{
                if (!req.timedout) { 
                    res.redirect('/login')
                }
            }
        }
        if(req.isAuthenticated() === false){
            if (!req.timedout) { 
                res.redirect('/login')                
            }
        }
    })

//login page
router.get('/login', checkNotAuthenticated, (req, res) => {
    if(!req.timedout){
        res.render('login')
    }
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