//import pkges
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//main model
const Category = db.categories
const Item = db.items
const Seller = db.sellers
const City = db.cities
const ItemCondition = db.conditions
const ItemImage = db.item_imgs


//get all items

//get all Item Page
const getAllItems = async (req,res) => {

    let name = req.query.name
    let category = req.query.category
    let city =req.query.city

    const cat =  await Category.findAll()
    const cty = await City.findAll()

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    if(!category && !name && !city){
        //take All Items
        const item =  await Item.findAndCountAll({
            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImg',
                attributes:[
                    'img'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && !name && !city){
        //get items by category
        const item =  await Item.findAndCountAll({
            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImg',
                attributes:[
                    'img'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId : category,
                status : 1
            },
            limit, offset
        })
        
        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && name && !city){
        //get items by name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && !name && city){
        //get items by city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemCity : city, 
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && name && !city){
        //get items by category and name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId : category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && name && city){
        //get items by name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemCity : city,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && !name && city){
        //get items by category and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId: category,
                itemCity : city,
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else{
        //get items by category , name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId: category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                itemCity : city,
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }
}



//Add items

const addItem = async (req,res) => {

    const {name,category_id,condition_id,price,description,cities_id,contact} = req.body
    const itemImages = req.files

    let itemImgs = []

    if(itemImages){
        for(var count=0; count<itemImages.length; count++){
            itemImgs[count] = itemImages[count].path
        }
    }

    if(!name || !category_id || !condition_id || !price || !description || !cities_id || !contact)
        return res.status(400).json({'message': 'All information are required'})

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
            where: {
                email : email
            }
        })
    
        if(!foundSeller) return res.sendStatus(403) //Forbidden

        const dt = formatDate(new Date()).toString()// date
        
 
        const newItem = await Item.create({
            category_id: category_id,
            seller_id: foundSeller.seller_id,
            name: name,
            condition_id: condition_id,
            price: price,
            date_time: dt,
            cities_id: cities_id,
            contact: contact,
            description: description,
            status: 1
        },{fields : ['category_id','seller_id','name','condition_id','price','date_time','cities_id','contact','description','status'] })
    

        
            const getItemId = await Item.findOne({
                where:{
                    seller_id: foundSeller.seller_id
                },
                order:[ [ 'id', 'DESC' ] ]
            })

            const newImage = await ItemImage.create({
                item_id: getItemId.item_id,
                img: itemImgs.toString(),
                status: 1
            }) 
        


        res.redirect('/account')
}

module.exports={
    addItem
}