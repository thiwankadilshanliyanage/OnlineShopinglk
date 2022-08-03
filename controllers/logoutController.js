//imports pkges
const db = require('../models')
const { sequelize, Sequelize } = require('../models')

//main model
const Seller = db.sellers

//logout
const logout = async(req,res)=>{
    res.cookie('jwt','',{ maxAge: 1 })
    res.redirect('/')
}

module.exports={
    logout
}