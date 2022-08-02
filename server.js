// import pakages
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const { JWTverify,currentUser } = require('./middleware/JWTverify')


// Port adding
const PORT = process.env.PORT || 8080
var coreOption = {
    origin: `https://localhost:${PORT}`
}

//pakges using
app.use(cors(coreOption))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//routes
const indexRouter = require('./routes/indexRouter.js')//index router
const listItemRouter = require('./routes/itemRouter')//item router
const regrouter = require('./routes/registerRouter.js')//register router
const loginRouter = require('./routes/loginRouter')//login router



//use routes 
app.use('/', indexRouter)//main page loading with categories
app.use('/list',listItemRouter)//item list
app.use('/register', regrouter)//register seller
app.use('/login',loginRouter)//login seller

//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});