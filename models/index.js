//import pkges
const dbConfig = require('../config/dbConfig.js');
const{Sequelize,DataTypes}= require('sequelize');

//assigning DB configuration to Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

//Authunticate to db throug seulize
sequelize.authenticate()
.then(()=>{
    console.log('connected..')
})
.catch(err=>{
    console.log('Error'+err)
})
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//assign models to db table
db.categories = require('./categoryModel.js')(sequelize,DataTypes)
db.cities = require('./cityModel.js')(sequelize,DataTypes)
db.conditions = require('./conditionModel.js')(sequelize,DataTypes)
db.items = require('./itemModel.js')(sequelize,DataTypes)
db.item_imgs = require('./item_imgModel.js')(sequelize,DataTypes)
db.sellers = require('./sellerModel.js')(sequelize,DataTypes)
db.user_imgs = require('./user_imgModel.js')(sequelize,DataTypes)

//syncronize db tables
db.sequelize.sync({force:false})
.then(()=>{
    console.log("sync-done")
})

//relationships(foreignkey)
//Category has many Items
db.categories.hasMany(db.items,{
    foreignKey: 'id',
    as: 'item'
})

db.items.belongsTo(db.categories,{
    foreignKey: 'id',
    as:'category'
})

//Cities has many Items
db.cities.hasMany(db.items,{
    foreignKey: 'cities_id',
    as: 'item'
})

db.items.belongsTo(db.cities,{
    foreignKey: 'cities_id',
    as:'city'
})

//ItemConditions has many Items
db.conditions.hasMany(db.items,{
    foreignKey: 'condition_id',
    as: 'item' 
})

db.items.belongsTo(db.conditions,{
    foreignKey: 'condition_id',
    as: 'condition'
})

//Cities has many sellers
db.cities.hasMany(db.sellers,{
    foreignKey: 'cities_id',
    as: 'seller'
})

db.sellers.belongsTo(db.cities,{
    foreignKey: 'cities_id',
    as:'city'
})

//seller has many items
db.sellers.hasMany(db.items,{
    foreignKey: 'seller_id',
    as:'item'    
})
db.items.belongsTo(db.sellers,{
    foreignKey:'seller_id',
    as:'seller'
})

//seller has many seller imges
db.sellers.hasMany(db.user_imgs,{
    foreignKey:'seller_id',
    as:'userImg'
})

db.user_imgs.belongsTo(db.sellers,{
    foreignKey: 'seller_id',
    as: 'seller'
})

//Item has many item images
db.items.hasMany(db.item_imgs,{
    foreignKey: 'item_id',
    as: 'itemImg'
})

db.item_imgs.belongsTo(db.items,{
    foreignKey: 'item_id',
    as: 'item'
})

//finally export module
module.exports = db