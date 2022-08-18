//import pkgs
const router = require('express').Router()
const sellerController = require('../controllers/sellerController')


//get login page and authorization
router.route('/')
    .get((req,res) =>{
        res.json({success:"Now you are in Login Page",status:200})
    })
    .post(sellerController.SellerLogin)


module.exports = router