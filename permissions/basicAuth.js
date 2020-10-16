function checkAuthenticated( req, res, next){
    if(req.isAuthenticated()){
        console.log('in the home page and authenticated')
        return next()
    }
    res.redirect('/login')
}

module.exports = {
    checkAuthenticated
}