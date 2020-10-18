const Post = require('../models/posts')


//can only edit the building if the authorization level is admin, manager, or tech
function canViewPost(user) {
    return(
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel == "TECH"   ||
        user.authorizationLevel == "BART"      )
}

function canEditPost(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel == "TECH"    
        )
}

function canCreatePost(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel == "TECH"   ||
        user.authorizationLevel == "BART"    
    )
}

function canDeletePost(user) {
    return (
        user.authorizationLevel === "ADMIN" ||
        user.authorizationLevel === "MANAGER" ||
        user.authorizationLevel == "TECH"   ||
        user.authorizationLevel == "BART"    )
}


module.exports = {
    canCreatePost,
    canDeletePost,
    canEditPost,
    canViewPost
}