//All imports
const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')



router.route('/')
    
    .get(cityController.getAllCities)
    .post(sellerController.addNewSeller)

    
module.exports = router