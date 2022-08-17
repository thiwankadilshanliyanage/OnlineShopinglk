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
const UserImage = db.user_imgs


//cookie life time
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
            const getSeller_id = await Seller.findOne({
                where:{
                    email: email
                }
            })

             if(sellerImage){
                const newImage = await UserImage.create({
                    seller_id: getSeller_id.id,
                    imageName: sellerImg,
                    status: 1
                })
            }else{
                const newImage = await UserImage.create({
                    seller_id: getSeller_id.id,
                    imageName: "",
                    status: 1
                })
            }
            res.status(400).json({'message': 'Register Successful'})
            // res.redirect('/login?success='+ encodeURIComponent('yes'))
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
       
       return res.status(400).json({'message': 'Not a registered user'})
    else{
        //evaluate password
        const match = await bcrypt.compare(password, foundSeller.password);
        if(match){
            
            const token = accessToken(foundSeller.email)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
            // res.redirect('/account')
            res.status(200).send({'message':'login success','access-token':token})
        }else{ 
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
        },
        {
            model: UserImage,
            as: 'userImg',
            attributes:[
                'img'
            ],
            where: { status: 1 }
        }
    ],
        attributes:{
            exclude: ['password']
        },
        where: {
            email : email
        }
    })
        console.log(foundSeller)
    if(!foundSeller) return res.sendStatus(403) //restricted(Forbiten error)

    const city =  await City.findAll()
    
    res.status(200).send({
        // cities : city,
        seller : foundSeller
        })    
   
}

//get seller details to the seller Profile
const getSellerInfotoSellerProfile = async (req,res) => {
  
    const seller_id = req.query.seller 

    if(!seller_id) return res.status(400).json({ 'message' : 'Specify a seller_id'})

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
            seller_id : seller_id
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
            seller_id : seller_id
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


//update SellerDetails
const updateSellerDetails = async (req,res) => {

    const {name,cities_id,email,firstConfirmYourPasswordFirst,CurrentPassword} = req.body   //editing detail

    const sellerImage = req.file        // seler img
    let sellerImg

    if(sellerImage){
        sellerImg =sellerImage.path
    }

    if(!name || !cities_id || !email || !CurrentPassword){
        return res.status(400).json({'message': 'All information are required'})        //check all seller detail are here
    }
    const token = req.cookies.jwt
    let semail
        
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error occured'})         //jwt errors
            }else{
               semail = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');         //if all are correct redirect to login page
    }
    
    if(!semail) return res.status(400).json({ 'message' : 'User not logged in'})

    const foundSeller = await Seller.findOne({
        where: {
            email : semail
        }
    })

    if(!firstConfirmYourPasswordFirst){
        if(!foundSeller) 
            return res.status(400).json({'message': 'No sellers'})
        else{
            //evaluate password
            const match = await bcrypt.compare(CurrentPassword, foundSeller.password);
            if(match){
                const updSeller = await Seller.update({
                    sellerName : name,
                    sellerCity: cities_id,
                    sellerEmail: email
                },{
                    where: {
                        id : foundSeller.id
                    }
                })
                //updating sellerImage
                if(sellerImage){
                    const foundImage = await sellerImage.findOne({
                        where:{
                            id : foundSeller.id,
                            status: 1
                        }
                    })

                    if(!foundImage){
                        const newImage = await sellerImage.create({
                            seller_id: foundSeller.id,
                            img: sellerImg,
                            status: 1
                        })
                    }else{
                        const updateImage = await sellerImage.update({  
                            status: 0
                        },{where: {
                                seller_id: foundSeller.id,
                                status: 1
                            }
                        })

                        const newImage = await sellerImage.create({
                            seller_id: foundSeller.id,
                            img: sellerImg,
                            status: 1
                        })       
                    }
                }
                
                const tkn = accessToken(email)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': 'Details Updated'})
            }else{ 
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }else{
        if(!foundSeller) 
            return res.status(400).json({'message': 'No such seller'})
        else{
            //evaluate password
            const match = await bcrypt.compare(CurrentPassword, foundSeller.password);
            if(match){

                const hashedPwd = await bcrypt.hash(firstConfirmYourPasswordFirst, 10)

                const updSeller = await Seller.update({
                    sellerName : name,
                    sellerCity: cities_id,
                    sellerEmail: email,
                    sellerPassword : hashedPwd
                },{
                    where: {
                        id : foundSeller.id
                    }
                })
                //updating Seller Image
                if(sellerImage){
                    const foundImage = await UserImage.findOne({
                        where:{
                            seller_id : foundSeller.id,
                            status: 1
                        }
                    })

                    if(!foundImage){
                        const newImage = await UserImage.create({
                            seller_id: foundSeller.id,
                            img: sellerImg,
                            status: 1
                        })
                    }else{
                        const updateImage = await UserImage.update({  
                            status: 0
                        },{where: {
                                seller_id: foundSeller.id,
                                status: 1
                            }
                        })

                        const newImage = await UserImage.create({
                            seller_id: foundSeller.id,
                            img: sellerImg,
                            status: 1
                        })       
                    }
                }

                const tkn = accessToken(email)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': 'Details Updated'})
            }else{ 
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }   
}

//remove seller photo
const removeSellerImage = async (req,res) => {
  
    const token = req.cookies.jwt
    let sellerEmail 
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                sellerEmail = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
   
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //restricted(forbiten error)

    const remImg = await sellerImage.update({
        status : 0
    },{
        where:{
            seller_id: foundSeller.id,
            status: 1
        }
    })
   
    res.redirect('/account/Usersettings')
}

module.exports = {
    addNewSeller,
    SellerLogin,
    removeSellerImage,
    updateSellerDetails,
    getSellerInfotoSellerProfile,
    getSellerDetailsFromSellerEmail,
    
}