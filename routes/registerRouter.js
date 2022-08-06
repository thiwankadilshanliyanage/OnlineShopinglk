// import pkgs
const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerimageUpload')



router.route('/')
    
    .get(cityController.getAllCities)
    .post(sellerImageMiddleware.upload,sellerController.addNewSeller)

    
module.exports = router