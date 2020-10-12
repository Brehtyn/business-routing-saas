const express = require('express')
const router = express.Router()
const Posts = require('../models/posts')
const Users = require('../models/user')

router.get('/', (req, res) => {
    res.render('posts/index')
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
        res.render('posts/new', {post: new Posts()})
})

router.post('/new', async( req, res) => {
    try{
        const post = new Posts({
            post: req.body.post,
            createdBy: req.user.name,
            createdAt: new Date(req.body.createdAt),
            asset_number: req.body.asset_number,
            location: req.body.location,
            status: req.body.status
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

router.post('/:id', async (req, res) => {
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

        res.redirect(`/posts/${post._id}`)

    }catch(err){
        console.log(err)
    }
})

router.put('/transfer/:id', async (req, res) => {
    try{
        const post = await Posts.findById(req.params.id)
        if(post.status == "HOLDING"){
            post.status = "PENDING"
        }else{
            post.status = "HOLDING"
        }
        await post.save()
        res.redirect('/')
    } catch{
        res.redirect('/posts')
    }
})


router.delete('/delete/:id', async (req, res) => {
    try{
        const post = await Posts.findById(req.params.id)
        await post.remove()
        res.redirect('/posts/all')
    } catch {
        res.redirect('/posts')
    }
})

module.exports = router