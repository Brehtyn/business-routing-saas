const express = require('express')
const router = express.Router()
const Posts = require('../models/posts')
const Users = require('../models/user')

router.get('/', (req, res) => {
    console.log(req.user.name)
    res.render('posts/index')
})

router.get('/comment/:id', async (req, res) => {
    try{
        const post = await Posts.findById(req.params.id)
        res.render('posts/new-comment', {post: post})
    }catch{
        res.redirect('/posts')
    }
})

router.post('/comment/:id', async (req, res) => {
    let comment = { user_id: req.user.name, comment: req.body.comment}
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

        res.redirect(`/posts/${post._id}`)

    }catch(err){
        console.log(err)
    }
})

//wouldn't have all comments here in posts, must go to individual page to find all comments
router.get('/all', async (req, res) => {
    let posts = []
    try{
        posts = await Posts.find().sort({createdAt: 'desc'}).limit(10).exec()
    } catch(err){
        console.log(err)
        posts = []
    }
    res.render('posts/all', {posts: posts})
})

router.get('/new', async (req, res) => {
    try{
        res.render('posts/new', {post: new Posts()})
    }catch(err){
        console.log(err)
        res.redirect('/posts')
    }
})

router.post('/new', async( req, res) => {
    try{
        const post = new Posts({
            post: req.body.post,
            createdBy: req.user.name
        })

        const newPost = await post.save()
        res.redirect(`/posts/${newPost._id}`)

    }catch(err){
        console.log(err)
        res.redirect('/posts')
    }
})

router.get('/:id', async (req, res) => {
    try{
        const post = await Posts.findById(req.params.id)
        //const comments = post.comments
        res.render('posts/show', {post: post})
    }catch(err){
        console.log(err)
        res.redirect('/posts')
    }
})

router.get('/delete', (req, res) => {

})

module.exports = router