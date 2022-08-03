//imports
const itemController = require('../controllers/itemControllers')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerimageUpload')
const itemImageMiddleware = require('../middleware/itemImageUpload')
const router = require('express').Router()


router.route('/')
    //get all Listings by the seller
    .get(itemController.searchAllItemsBySeller)

router.route('/add')
    //add listing -- get categories, itemconditions, cities ,sellerContact, sellerCity
    .get(itemController.getAddItemNecessityInfo)
    //save listing
    .post(itemImageMiddleware.upload,itemController.addItem)

router.route('/edit')
    //edit listing --  get categories, itemconditions, cities ,itemContact, itemCity
    .get(itemController.searchItemDetails)
    //save edit listing
    .post(itemImageMiddleware.upload,itemController.editItem)

router.route('/edit/delimgs')
    .get(itemController.delImgs)

router.route('/delete')
    //delete or unpublish listing
    .get(itemController.unpublishItembyitemid)   

router.route('/settings')
    //get seller details
    .get(sellerController.getSellerDetailsFromSellerEmail)
    //update change settings
    .post(sellerImageMiddleware.upload,sellerController.updateSellerDetails)

router.route('/settings/imgdel')
    .get(sellerController.removeSellerImage)


module.exports = router