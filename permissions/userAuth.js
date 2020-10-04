const User = require('../models/user')


//can only edit the building if the authorization level is admin, manager, or tech
function canViewUser(user) {
    return(
        user.authorizationLevel === "ADMIN"
    )
}

function canEditUser(user) {
    return (
        user.authorizationLevel === "ADMIN" 
    )
}

function canCreateUser(user) {
    return (
        user.authorizationLevel === "ADMIN"
    )
}

function canDeleteUser(user) {
    return (
        user.authorizationLevel === "ADMIN"
    )
}


module.exports = {
    canCreateUser,
    canDeleteUser,
    canEditUser,
    canViewUser
}