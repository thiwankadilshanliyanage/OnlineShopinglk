// import pakages
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const { JWTverify,currentUser } = require('./middleware/JWTverify')//authorize


// Port adding
const PORT = process.env.PORT || 8080
var coreOption = {
    origin: `https://localhost:${PORT}`
}

//pakges using
app.use(cors(coreOption))//resource sharing
app.use(express.json())//building middleware
app.use(express.urlencoded({extended:true}))//url endcoding
app.use(cookieParser())//cookie-parser

//routes
const indexRouter = require('./routes/indexRouter.js')//index router
const listItemRouter = require('./routes/itemRouter')//item router
const regrouter = require('./routes/registerRouter.js')//register router
const loginRouter = require('./routes/loginRouter')//login router
const logoutRouter = require('./routes/logoutRouter')//logout router
const accountRouter = require('./routes/accountRouter')//account router
const sellerRouter = require('./routes/sellerRouter')//seer router
//const { verify } = require('jsonwebtoken')



//use routes 
app.use('*',currentUser)//seller data taking as response to every route
app.use('/', indexRouter)//main page loading with categories
app.use('/list',listItemRouter)//item list
app.use('/seller',sellerRouter)//seller profile route
app.use('/register', regrouter)//register seller
app.use('/login',loginRouter)//login seller
app.use('/account',JWTverify, accountRouter)//seller every detail
app.use('/logout',logoutRouter)//logout router
app.use('/images',express.static('./images'))//img folder

//server running on
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});