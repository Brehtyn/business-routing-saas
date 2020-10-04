const User = require('../models/user')


//can only edit the machine if the authorization level is admin, manager, or tech
function canEditMachine(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel === "TECH"
    )
}

function canCreateMachine(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER"
    )
}

function canDeleteMachine(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" 
    )
}

function canUpdateMachine(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel === "TECH"
    )
}

module.exports = {
    canEditMachine,
    canDeleteMachine,
    canCreateMachine,
    canUpdateMachine
}