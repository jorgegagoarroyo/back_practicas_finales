const express = require("express")
const router = express.Router()
const tablas = require("./tabla")
const usuarios = require("./usuarios")

//rutas

router.use("/tablas", tablas)
router.use("/usuarios", usuarios)

router.get("/", (req, res)=>{
    res.send("estas en router")
})

module.exports = router