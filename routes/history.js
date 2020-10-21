const express = require('express')
const router = express.Router()
const History = require('../models/history')
const Post = require('../models/posts')
const { checkAuthenticated } = require('../permissions/basicAuth')

//this one will show the existing that you are going to email
router.get('/', checkAuthenticated, async (req, res) => {
        try{
            const user = req.user
            //should only find the latest document
            const history = await History.find().sort({createdAt: 'desc'}).limit(1).exec()
            if (!req.timedout) { 
                res.render('history/index',{ history: history, authorizationLevel: user.authorizationLevel })                
            }
        }catch{
            if (!req.timedout) { 
                res.render('/')                
            }
        }
})

//makes a new history document (per week)
router.post('/',checkAuthenticated, async (req, res) =>{
        try{
            const history = new History()
            const newHistory = await history.save()
            if (!req.timedout) { 
                res.redirect('/history')                
            }
        }catch(err){
            console.log(err)
            if (!req.timedout) { 
                res.redirect('/')                
            }
        }
})

//update existing document
router.put('/update/:id',checkAuthenticated, async (req, res) =>{
        try{
            //history is actually an array so need to get first element
            const history = await History.find().sort({createdAt: 'desc'}).limit(1).exec()
            const post = await Post.findById(req.params.id)
            let firsthistory = history[0]
    
            History.updateOne({
                _id: firsthistory._id },
             {
                $push: { post: post}
             },
             function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            }).then(
                await post.remove()
            )
            if (!req.timedout) { 
                res.redirect('/history')                
            }
    
        }catch{
            if (!req.timedout) { 
                res.redirect('/')               
            }
        }
})

module.exports = router