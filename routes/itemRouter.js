//imports
const itemController = require('../controllers/itemControllers')
const router = require('express').Router()

router.route('/')
    //List Items Page
    .get(itemController.getAllItems)
    //List filterd Items - category or city or name
    .post(itemController.postSearchItems)

router.route('/item')
    //Show item and details
    .get(itemController.getItemInformation)



module.exports = router