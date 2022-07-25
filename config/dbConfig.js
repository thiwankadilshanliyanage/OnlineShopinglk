// DB configure

const Pool = require("mysql2/typings/mysql/lib/Pool");

module.exports = {
    Host:'localhost',
    USER:'root',
    PASSWORD:'thiwanka123',
    DB:'OnlineShoppinglk',
    dialect:'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}