const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

//getUserByUsername is function that gets user associated to email provide
//getUserByID is function that gets user ID associated to the email provided
async function initialize(passport, getUserByUserName, getUserByID){
    const authenticateUser = async (username, password, done) =>{
        const user = await User.findOne({username: username})
        if(user == null) {
            return done(null, false, {message: 'No user with that user name'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }catch(e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) =>  done(null, user.id))
    passport.deserializeUser((id, done) => {
       return done(null,User.findById(id))
    })

}


module.exports = initialize