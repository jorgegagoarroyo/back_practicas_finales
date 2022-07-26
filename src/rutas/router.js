const express = require("express")
const router = express.Router()
const tablas = require("./tabla")

//rutas

router.use("/tablas", tablas)

router.get("/", (req, res)=>{
    res.send("estas en router")
})

module.exports = router