// import pakages
const express = require('express')
const cors = require('cors')
const app = express()

// Port adding
var coreOption = {
    origin:'https://locallhost:8081'
}

//palges using
app.use(cors(coreOption))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//testing
app.get('/',(req,res)=>{
    res.json({messag: 'hello from api'})
})

//port
const PORT = process.env.PORT || 8080;
//server
app.listen(PORT,()=>{
    console.log('server is running on port ${PORT}')
})