const express = require('express')
const router = express.Router()
const Posts = require('../models/posts')
const Users = require('../models/user')
const { checkAuthenticated } = require('../permissions/basicAuth')
const { canEditPost, canDeletePost, canCreatePost, canViewPost} = require('../permissions/postAuth')


router.get('/new', checkAuthenticated,authViewPost, async (req, res) => {
    if(!req.timedout){
        const user = req.user
        res.render('posts/new', {post: new Posts(), authorizationLevel: user.authorizationLevel})
    }
})

router.post('/new', checkAuthenticated,authCreatePost, async( req, res) => {
        try{
            const post = new Posts({
                post: req.body.post,
                createdBy: req.user.name,
                asset_number: req.body.asset_number,
                location: req.body.location            })
            const newPost = await post.save()
            if (!req.timedout) { 
                res.redirect(`/posts/${newPost._id}`)
            }
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/posts/new')
            }
        }
})

router.get('/:id', checkAuthenticated,authViewPost, async (req, res) => {
        try{
            const user = req.user
            const post = await Posts.findById(req.params.id)
            if (!req.timedout) { 
                res.render('posts/show', {post:post, authorizationLevel: user.authorizationLevel})
            }
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/posts/:id') 
            }
        }
})

router.get('/edit/:id', checkAuthenticated,authEditPost, async(req, res) =>{
        try{
            const user = req.user
            const post = await Posts.findById(req.params.id)
            if (!req.timedout) { 
                res.render('posts/edit', {post:post, authorizationLevel: user.authorizationLevel})
            }
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/posts/edit/:id')
            }
        }
})

router.post('/edit/:id', checkAuthenticated,authEditPost, async (req, res) => {
        try{
            const post = await Posts.findById(req.params.id)
            
            post.post = req.body.post
            const newPost = await post.save()
            if (!req.timedout) { 
                res.redirect(`/posts/${post._id}`)
            }    
    
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/') 
            }
        }
})

router.post('/:id', checkAuthenticated,authViewPost, async (req, res) => {
        let comment = { userId: req.user.name, comment: req.body.comment}
        try{
            const post = await Posts.findById(req.params.id)
            
            Posts.updateOne({
                    _id: post._id },
                 {
                    $push: { comments: comment}
                 },
                 function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(success);
                    }
                })

                if (!req.timedout) { 
                    res.redirect(`/posts/${post._id}`)
                }
    
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/')
            }
        }
})

router.put('/transfer/:id',checkAuthenticated, async (req, res) => {
        try{
            const post = await Posts.findById(req.params.id)
            if(post.status == "HOLDING"){
                post.status = "PENDING"
            }else{
                post.status = "HOLDING"
            }
            await post.save()
            if (!req.timedout) { 
                res.redirect('/')
            }
        } catch{
            if (!req.timedout) { 
                res.redirect('/')  
            }
        }
})


router.delete('/delete/:id',checkAuthenticated,authDeletePost, async (req, res) => {
        try{
            const post = await Posts.findById(req.params.id)
            await post.remove()
            if (!req.timedout) { 
                res.redirect(`${req.body.url}`)
            }
        } catch {
            if (!req.timedout) { 
                res.redirect('/')
            }
        }
})

//checks if user is authorized to edit project
function authEditPost(req, res, next) {
    if(!canEditPost(req.user)){
        res.redirect('/')
        return res.end()
    }
    next()
}

function authCreatePost(req, res, next) {
    if(!canCreatePost(req.user)){
        res.redirect('/post')
        return res.end()
    }
    next()
}

function authDeletePost(req, res, next) {
    if(!canDeletePost(req.user)){
        res.redirect('/')
        return res.end()
    }
    next()
}

function authViewPost(req, res, next) {
    if(!canViewPost(req.user)){
        res.redirect('/')
        return res.end()
    }
    next()
}

module.exports = router