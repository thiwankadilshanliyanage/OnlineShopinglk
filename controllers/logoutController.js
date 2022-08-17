//imports pkges
const db = require('../models')
const { sequelize, Sequelize } = require('../models')

//main model
const Seller = db.sellers

//logout
const logout = async(req,res)=>{

    req.email = null
    res.cookie('jwt','',{ maxAge: 1 })
    // res.redirect('/')
    res.status(200).json({ 'message' : 'Logout successfull'})
}

module.exports={
    logout
}