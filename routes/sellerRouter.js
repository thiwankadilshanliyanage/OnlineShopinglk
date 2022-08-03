const sellerController = require('../controllers/sellerController')
const router = require('express').Router()

router.route('/')
    //seller profile 
    .get(sellerController.getSellerInfotoSellerProfile)

module.exports = router