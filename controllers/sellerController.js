//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
require('dotenv').config();


//create main Model
const Seller = db.sellers
const City = db.cities


//Time for cookie to be saved
const maxAge = 3 * 24 * 60 * 60

//main work

//register  new seller
const addNewSeller = async (req,res) => {
    const {name,email,password,cities_id} = req.body

    //all data is available
    if(!name || !email || !password || !cities_id)
        return res.status(400).json({'message': 'All information are required'})

    //checking same sellers
    const duplicate = await Seller.findAll({
        where: {
            email : email
        }
    })

    if(duplicate.length>0) 
        return res.send({'message': 'Seller already registered' });
    else{
        try{
            //encrypt the password
            const hashedPwd = await bcrypt.hash(password, 10)

            //add new seller to db
            const newSeller = await Seller.create({
                name: name,
                email: email,
                password: hashedPwd,
                cities_id: cities_id    
            },{fields : ['name','email','password','cities_id'] })
            res.redirect('/login?success='+ encodeURIComponent('yes'))
        } catch (err){
            res.status(500).json({'message': err.message })
        }
    }

}
module.exports = {
    addNewSeller
    
}