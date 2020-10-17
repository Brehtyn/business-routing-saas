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
const flash = require('express-flash')
const RedisStore = require('connect-redis')(session)
// const client = require('redis').createClient(process.env.REDIS_URL)
// const Redis = require('ioredis')
// const redis = new Redis(process.env.REDIS_URL)

const indexRouter = require('./routes/index')
const buildingsRouter = require('./routes/buildings')
const machinesRouter = require('./routes/machines')
const userRouter = require('./routes/users') 
const postRouter = require('./routes/posts')
var favicon = require('serve-favicon');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.static(__dirname + '/public/assets/stylesheets/style.css'))
app.use(express.static('permissions'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.use(flash())

app.use(session({
    store: new RedisStore({
        url: process.env.REDIS_URL
    }),
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

app.use('/', indexRouter)
app.use('/buildings', buildingsRouter)
app.use('/machines', machinesRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)

app.listen(process.env.PORT || 3000)