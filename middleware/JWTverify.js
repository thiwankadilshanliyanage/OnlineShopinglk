//import pkges
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()


//main model
const Seller = db.sellers


//main work

 //check JWT exists & is verified
const JWTverify = (req, res, next) => {
    const token = req.cookies.jwt  
    const authHeader = req.headers['authorization']
    const acctoken = authHeader && authHeader.split(' ')[1]  
   
    if(token != acctoken) return res.status(403).send({ message : 'Invalid Access Token'})

    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
    
}

//Current user
const currentUser = (req,res,next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                let seller = await Seller.findAll({
                    attributes:{
                        exclude: 'password'
                    },
                    where: {
                        email : decodedToken.email
                    }
                })
                res.locals.user = seller
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}


module.exports = { JWTverify,currentUser }