//imports
const itemController = require('../controllers/itemControllers')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerimageUpload')
const itemImageMiddleware = require('../middleware/itemImageUpload')
const router = require('express').Router()


router.route('/')
    .get(itemController.searchAllItemsBySeller)    //get all Listings by the seller
router.route('/add')
    .get(itemController.getAddItemNecessityInfo) //add listing -- get categories, itemconditions, cities ,sellerContact, sellerCity
    .post(itemImageMiddleware.upload,itemController.addItem) //save listing

router.route('/edit')
    .get(itemController.searchItemDetails) //edit listing --  get categories, itemconditions, cities ,itemContact, itemCity   
    .post(itemImageMiddleware.upload,itemController.editItem)//save edit listing

router.route('/edit/delimgs')
    .get(itemController.deleteImgs)//delet img

router.route('/delete')
    .get(itemController.unpublishItembyitemid) //delete or unpublish listing  

router.route('/settings')
    .get(sellerController.getSellerDetailsFromSellerEmail)//get seller details
    .post(sellerImageMiddleware.upload,sellerController.updateSellerDetails)//update change settings

router.route('/settings/imgdel')
    .get(sellerController.removeSellerImage)


module.exports = router