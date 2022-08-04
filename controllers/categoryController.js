//import
const db =  require('../models')
const { sequelize, Sequelize } = require('../models')

//main model
const Category = db.categories
const Item = db.items

//get all categories with count of items
const getAllCategoriesWithItemCount = async (req,res) => {

    const category =  await Category.findAll({
        attributes: {
            include: [
                [sequelize.fn('COUNT',sequelize.col('item.id')),'itemCount']
            ]
        } ,
        include:[{
            model: Item,
            as: 'item',
            attributes:[]
        }],
        group: ['category.id'],
        order: sequelize.literal('itemCount DESC') 
    })

    res.status(200).send({
        categories: category
    })

}

//module export
module.exports = {
    getAllCategoriesWithItemCount
}