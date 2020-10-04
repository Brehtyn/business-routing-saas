const User = require('../models/user')


//can only edit the building if the authorization level is admin, manager, or tech
function canEditBuilding(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER"
    )
}

function canCreateBuilding(user) {
    return (
        user.authorizationLevel === "ADMIN"
    )
}

function canDeleteBuilding(user) {
    return (
        user.authorizationLevel === "ADMIN"
    )
}


module.exports = {
    canCreateBuilding,
    canDeleteBuilding,
    canEditBuilding
}