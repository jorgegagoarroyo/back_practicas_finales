//imports
const express = require("express")
const cors = require("cors")
const router = require("./rutas/router.js")
const db = require("./database")
require("dotenv").config()

const app = express()

//temporales
const morgan = require("morgan")
app.use(morgan('tiny'))

//middlwares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//rutas 
app.use("/api", router)

app.get("/", (req,res)=>{
    res.send("estas en la raiz de practicas FPLLEFIA")
})


//port listen
app.listen(process.env.PORT, ()=>{
    console.log("estas escuchando en el puerto ", process.env.PORT)
})