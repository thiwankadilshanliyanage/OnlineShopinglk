
//All imports
const router = require('express').Router()
const categoryController = require('../controllers/categoryController')



router.route('/')
    
.get(categoryController.getAllCategoriesWithItemCount)    

    
module.exports = router