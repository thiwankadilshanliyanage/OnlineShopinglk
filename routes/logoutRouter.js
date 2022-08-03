//import pkges
const router = require('express').Router()
const logoutController = require('../controllers/logoutController')

//logout
router.route('/')
    .get(logoutController.logout)

    module.exports = router