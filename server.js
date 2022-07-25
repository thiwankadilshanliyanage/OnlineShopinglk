// import pakages
const express = require('express')
const cors = require('cors')
const app = express()

// Port adding
const PORT = process.env.PORT || 8081
var coreOption = {
    origin: `https://localhost:${PORT}`
}

//palges using
app.use(cors(coreOption))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//testing
app.get('/',(req,res)=>{
    res.json({messag: 'hello from api'})
})


//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});