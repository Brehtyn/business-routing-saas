const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    var app = req.app;
    const allBuildingsArray = (app.get('allBuildings'))

    res.render('index', { allBuildingsArray: allBuildingsArray })
})

module.exports = router