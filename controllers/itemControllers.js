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
    const { limit, offset } = getPagination(page, size);//pagination

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

        const pagitem = getPagingData(item, page, limit)//pagination page data

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
                id : category,
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
                as: 'itemImg',
                attributes:[
                    'img'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                name : {[Sequelize.Op.like]: `%${name}%`},
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
                as: 'itemImg',
                attributes:[
                    'img'
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
                as: 'itemImg',
                attributes:[
                    'img'
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
                as: 'itemImg',
                attributes:[
                    'img'
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
                as: 'itemImg',
                attributes:[
                    'img'
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
//searched Items
const searchedItems = (req,res) =>{
    let name = req.body.name
    let category = req.body.category
    let city = req.body.city

    if(!name && !category && !city)
        res.redirect(`/list`)
    else if(name && !category && !city)
        res.redirect(`/list?name=${name}`)
    else if(!name &&  category && !city)
        res.redirect(`/list?category=${category}`)
    else if(!name &&  !category && city)
        res.redirect(`/list?city=${city}`)
    else if(name &&  category && !city)
        res.redirect(`/list?name=${name}&category=${category}`)
    else if(name &&  !category && city)
        res.redirect(`/list?name=${name}&city=${city}`)
    else if(!name &&  category && city)
        res.redirect(`/list?category=${category}&city=${city}`)
    else
        res.redirect(`/list?name=${name}&category=${category}&city=${city}`)
}

//search items by seller
const searchAllItemsBySeller = async (req,res) => {

    const token = req.cookies.jwt
    let email 
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error occured'});
            }else{
                email = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!email) return res.status(400).json({ 'message' : 'User not login now'})

    const foundSeller = await Seller.findOne({
        where: {
            email : email
        }
    })

    if(!foundSeller) return res.sendStatus(403) //restrict

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
        } ,{
            model: ItemImage,
            as: 'itemImg',
            attributes:[
                'img' 
            ],
            where: {
                status: 1
            }
        } ],
        attributes:{
            exclude: ['category_id','seller_id','condition_id','cities_id','contact','description','status']
        },
        where: {
            status : 1,
            seller_id : foundSeller.id
        }
    })
    
    if(item.length>0){
        res.status(200).send({
            items : item
        })    
    }else{
        return res.status(400).json({ 'message' : 'No Items'})
    }

   
}

//search items by itemId to edit
const searchItemDetails = async (req,res) => {
    const itemId = req.query.id
    
    const token = req.cookies.jwt
    let email 
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error occured'})
            }else{
                email = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
   
    const foundSeller = await Seller.findOne({
        where: {
            email : email
        }
    })

    if(!foundSeller) return res.sendStatus(403) //restric

    const item =  await Item.findOne({
        include:[
            {
                model: ItemImage,
                as: 'itemImg',
                attributes:[
                    'img' // in the front end split the string to an array and seperately get the images
                ],
                where:{
                    status: 1
                }
            } 
        ],
        where: {
            itemId : itemId,
            seller_id : foundSeller.id,
            status : 1
        }
    })

    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()

    if(!item) return res.sendStatus(403)
    
    const foundCity = await City.findOne({
        where: {
            cityId: item.cities_id
        }
    })

    res.status(200).send({
        categories : category,
        itemConditions : icondition,
        cities : city,
        item : item,
        details : {
            contact: item.contact,
            city : foundCity.city
        }
        })    
   
}

//Item Information to normal user
const getItemInformation = async (req,res) => {
    const itemId = req.query.id

    if(!itemId) return res.status(400).json({ 'message' : 'Specify an item id'})
    
    const item =  await Item.findOne({
        include: [{
            model: Seller,
            as: 'seller',
            attributes:[
                'name'
            ]
        },{
            model: ItemImage,
            as: 'itemImg',
            attributes:[
                'img' //can split and get the images seperately to put into the slider
            ],
            where:{
                status:1
            }
        }],
        where: {
            itemId : itemId,
            status : 1
        }
    })

    if(!item) return res.status(400).json({ 'message' : 'No such item'})

    res.status(200).send({
        item : item,
        })    
   
}

//get add item page necessary data
const getAddItemNecessityInfo = async (req,res) => {
    const token = req.cookies.jwt
    let email 
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error occured'})
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

    if(!foundSeller) return res.sendStatus(403) //restric

    const foundCity = await City.findOne({
        where: {
            cityId: foundSeller.cities_id
        }
    })

    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()
    
    res.status(200).send({
        categories : category,
        itemConditions : icondition,
        cities : city,
        details : {
         //   contact: foundSeller.sellerContact,
            city : foundCity.city
        }
        })    
   
}

//unpublish item by item id
const unpublishItembyitemid = async (req,res) => {
    const itemId = req.query.id
    
    const token = req.cookies.jwt
    let email 
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error occured'})
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

    if(!foundSeller) return res.sendStatus(403) //restric

    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            seller_id : foundSeller.id,
            status : 1
        }
    })
    
    if(!item) return res.sendStatus(403)
    
    const remItem = await Item.update({
        status :0
    },{
        where: {
            itemId : itemId,
            seller_id : foundSeller.id
        }
    })

    res.redirect('/account')     
   
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
        console.log(email,foundSeller.id)
    
        if(!foundSeller) return res.sendStatus(403) //restric

        const dt = formatDate(new Date()).toString()// date
        
 
        const newItem = await Item.create({
            category_id: category_id,
            seller_id: foundSeller.id,
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
                    seller_id: foundSeller.id
                },
                order:[ [ 'id', 'DESC' ] ]
            })
                console.log(getItemId.id)
            const newImage = await ItemImage.create({
                item_id: getItemId.id,
                img: itemImgs.toString(),
                status: 1
            },{fields : ['item_id','img','status'] })
     
        


        res.redirect('/account')
}

//Edit Item 
const editItem = async (req,res) => {

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

        const itemId = req.query.id
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
    
        if(!foundSeller) return res.sendStatus(403) //restric

        const foundItem= await Item.findOne({
            where: {
                itemId : itemId,
                seller_id : foundSeller.id
            }
        })
    
        if(!foundItem) return res.sendStatus(403) //restric

        const updateItem = await Item.update({
            category_id: category_id,
            name: name,
            condition_id: condition_id,
            price: price,
            cities_id: cities_id,
            contact: contact,
            description: description,
            status: 1
        },{
            where: {
                itemId : itemId,
                seller_id : foundSeller.id
            }
        })

        if(itemImages){
            const currentImgs = await ItemImage.update({
                status: 0
            },{
                where: {
                    itemId : foundItem.id,
                    status : 1
                }
            })

            const newImgs = await ItemImage.create({
                itemId: foundItem.id,
                imageName: itemImgs.toString(),
                status: 1
            })
        }
    
        res.redirect('/account')
}

//remove item images
const deleteImgs = async (req,res) => {
  
    const itemId = req.query.id
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
   
    const foundItem = await Item.findOne({
        where: {
            itemId : itemId,
            status: 1
        }
    })

    if(!foundItem) return res.sendStatus(403) //restric

    const remImg = await ItemImage.update({
        status : 0
    },{
        where:{
            itemId: foundItem.id,
            status: 1
        }
    })

    const updImg = await ItemImage.create({
                itemId: foundItem.id,
                imageName: '',
                status: 1
    })
   
    res.redirect('/account/edit?itemId='+foundItem.id)
}

//Date and Time format
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
  };

module.exports={
    getAllItems,
    searchedItems,
    searchAllItemsBySeller,
    searchItemDetails,
    getItemInformation,
    unpublishItembyitemid,
    getAddItemNecessityInfo,
    addItem,
    editItem,
    deleteImgs
}