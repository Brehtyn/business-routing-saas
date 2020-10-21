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
const indexRouter = require('./routes/index')
const buildingsRouter = require('./routes/buildings')
const machinesRouter = require('./routes/machines')
const userRouter = require('./routes/users') 
const postRouter = require('./routes/posts')
const historyRouter = require('./routes/history')
const errorRouter = require('./routes/error')
var favicon = require('serve-favicon');
var timeout = require('connect-timeout')

function haltOnTimedout(err,req,res,next) {
    if (req.timedout === true) {
        if (res.headersSent) {
            next(err);
        } else {
            res.redirect('error')
        }
    } else {
        next();
    }
};

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(timeout('15s'))
app.use(expressLayouts)
app.use(haltOnTimedout)
app.use(express.static(__dirname + '/public/assets/stylesheets/style.css'))
app.use(haltOnTimedout)
app.use(express.static('public'))
app.use(haltOnTimedout)
app.use(express.static('permissions'))
app.use(haltOnTimedout)
app.use(bodyParser.urlencoded({extended: false}))
app.use(haltOnTimedout)
app.use(bodyParser.json())
app.use(haltOnTimedout)
app.use(methodOverride('_method'))
app.use(haltOnTimedout)
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(haltOnTimedout)
app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.use(haltOnTimedout)
app.use(flash())
app.use(haltOnTimedout)
app.use(haltOnTimedout)


if (app.get('env') === 'development') {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    }))
  } else{
    const RedisStore = require('connect-redis')(session)
    const client = require('redis').createClient(process.env.REDIS_URL)
    const Redis = require('ioredis')
    const redis = new Redis(process.env.REDIS_URL)
    
    app.use(session({
        store: new RedisStore({
            client: client,
            url: process.env.REDIS_URL
        }),
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    }))
  }
app.use(passport.initialize())
app.use(haltOnTimedout)
app.use(passport.session())
app.use(haltOnTimedout)

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err))
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use(haltOnTimedout)
app.use('/buildings', buildingsRouter)
app.use(haltOnTimedout)
app.use('/machines', machinesRouter)
app.use(haltOnTimedout)
app.use('/users', userRouter)
app.use(haltOnTimedout)
app.use('/posts', postRouter)
app.use(haltOnTimedout)
app.use('/history', historyRouter)
app.use(haltOnTimedout)
app.use('/error', errorRouter)
app.use(haltOnTimedout)



app.listen(process.env.PORT || 3000)