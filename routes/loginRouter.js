//import pkgs
const router = require('express').Router()
const sellerController = require('../controllers/sellerController')


//get login page and authorization
router.route('/')
    .get((req,res) =>{
        res.send('Now you are in Login Page')
    })
    .post(sellerController.SellerLogin)


module.exports = router