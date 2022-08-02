//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();


//main model
const Category = db.categories
const Item = db.items
const Seller = db.sellers
const City = db.cities
const ItemImage = db.item_imgs
const sellerImage = db.user_imgs


//Time for cookie to be saved
const maxAge = 3 * 24 * 60 * 60

//main work

//register  new seller
const addNewSeller = async (req,res) => {
    const {name,email,password,cities_id} = req.body

    const sellerImage = req.file
    let sellerImg

    if(sellerImage){ 
        sellerImg =sellerImage.path
    }

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

            //image uploader
             if(sellerImage){
                const getSellerId = await Seller.findOne({
                    where:{
                        email: email
                    }
                })

                const newImage = await sellerImage.create({
                    sellerId: getSellerId.id,
                    imageName: sellerImg,
                    status: 1
                })
            }

            res.redirect('/login?success='+ encodeURIComponent('yes'))
        } catch (err){
            res.status(500).json({'message': err.message })
        }
    }

}
//login seller

const SellerLogin = async (req,res) => {
    const {email, password} = req.body

    if(!email || !password) return res.status(400).json({'message': 'Email and Password are required'})

    const foundSeller = await Seller.findOne({
        where: {
            email : email
        }
    })

    if(!foundSeller) 
       // return res.redirect('/login?avail='+ encodeURIComponent('no'))
       return res.status(400).json({'message': 'Not a registered user'})
    else{
        //evaluate password
        const match = await bcrypt.compare(password, foundSeller.password);
        if(match){
            
            const token = accessToken(foundSeller.email)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
            res.redirect('/account')
        }else{ 
            //res.redirect('/login?sucess='+ encodeURIComponent('no'))
            res.status(400).json({'message': 'Email and Password do not match'})
        }
    }   
}

//Generate access token
const accessToken = (email) => {
    return jwt.sign({email},process.env.TOKEN_SECRET,{ expiresIn : maxAge })
}


//get seller details from sellerEmail
const getSellerDetailsFromSellerEmail = async (req,res) => {
  
    const token = req.cookies.jwt
    let email 
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                email = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!email) return res.status(400).json({ 'message' : 'User not logged in'})
   
    const foundSeller = await Seller.findOne({
        include:[{
            model: City,
            as: 'city',
            attributes:[
                'city'
            ]
        },{
            model: sellerImage,
            as: 'userImg',
            attributes:[
                'img'
            ],
            where: { status: 1 }
        }],
        attributes:{
            exclude: ['password']
        },
        where: {
            email : email
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    const city =  await City.findAll()
    
    res.status(200).send({
        cities : city,
        seller : foundSeller
        })    
   
}

//get seller details to the seller Profile
const getSellerInfotoSellerProfile = async (req,res) => {
  
    const sellerId = req.query.seller 

    if(!sellerId) return res.status(400).json({ 'message' : 'Specify a sellerId'})

    const foundSeller = await Seller.findOne({
        include:[{
            model: City,
            as: 'city',
            attributes:[
                'city'
            ]
        }],
        attributes:{
            exclude: ['id','cities_id','email','password']
        },
        where: {
            sellerId : sellerId
        }
    })

    if(!foundSeller) return res.status(400).json({ 'message' : 'No such seller'})
    
    const item =  await Item.findAll({
        include:[{
            model: Category,
            as: 'category',
            attributes:[
                'category_name'
            ]
        },{
            model: City,
            as: 'city',
            attributes:[
                'city'
            ]
        },{
            model: ItemImage,
            as: 'itemImg',
            attributes: [
                'img'
            ],
            where:{
                status: 1
            }
        }],
        attributes:{
            exclude: ['id','seller_id','condition_id','cities_id','contact','description','status']
        },
        where: {
            status : 1,
            sellerId : sellerId
        }
    })
    
    if(item.length>0){
        res.status(200).send({
            seller : foundSeller,
            items : item
            })   
    }else{
        res.status(200).send({
            seller : foundSeller,
            message : 'no Items'
            })   
    }



     
   
}

module.exports = {
    addNewSeller,
    SellerLogin
    
}