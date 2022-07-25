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
db.category = require('./categoryModel.js')(sequelize,DataTypes)
db.city = require('./cityModel.js')(sequelize,DataTypes)
db.condition = require('./conditionModel.js')(sequelize,DataTypes)
db.item = require('./itemModel.js')(sequelize,DataTypes)
db.item_img = require('./item_imgModel.js')(sequelize,DataTypes)
db.seller = require('./sellerModel.js')(sequelize,DataTypes)
db.user_img = require('./user_imgModel.js')(sequelize,DataTypes)

//syncronize db tables
db.sequelize.sync({force:false})
.then(()=>{
    console.log("sync-done")
})

//relationships


//finally export module
module.exports = db