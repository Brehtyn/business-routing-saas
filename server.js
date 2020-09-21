if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const buildingsRouter = require('./routes/buildings')
const machinesRouter = require('./routes/machines')
const userRouter = require('./routes/users') 

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.SESSION_SECRET))

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//connecting to mongodb using mongodb
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true , useUnifiedTopology: true})
    
client.connect(err => {
        //db_obj is a database object of the test database
        const db_obj = client.db('casino-software')
        //gets info from buildings in db
        const buildingInfo = db_obj.collection('buildings')
        //gets info from machines in db
        const machineInfo = db_obj.collection('machines')
    
        //buildings function gets an array of all the buildings
        async function buildings(){
        const buildingDetailsArray = (await buildingInfo.find({})
                        .toArray()
                        .then(result => result)
                        .catch(error => console.log(error)))
        
        //the result is an array of json objects
        const allBuildings = await buildingDetailsArray
        app.set("allBuildings", allBuildings)

        return allBuildings
        }

        async function machines() {
            const machineDetailsArray = (await machineInfo.find({})
                        .toArray()
                        .then(result => result)
                        .catch(error => console.log(error)))
            const allMachines = await machineDetailsArray
            app.set("allMachines", allMachines)
            return allMachines
        }
        buildings()
        machines()
    });

app.use('/', indexRouter)
app.use('/buildings', buildingsRouter)
app.use('/machines', machinesRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3000)