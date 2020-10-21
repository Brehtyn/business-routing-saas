const express = require('express')
const router = express.Router()

router.get('/', async (req, res) =>{
    res.render('timedout')
})

router.get('/general', async(req, res) => {
    res.render('_general_error')
})

module.exports = router