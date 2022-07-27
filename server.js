// import pakages
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')


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

const regrouter = require('./routes/registerRouter.js')
app.use('/register', regrouter)

//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});