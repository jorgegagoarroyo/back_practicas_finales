const express = require("express")
const router = express.Router()
const clave = require("../middleware/clave")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, ingresar } = require("../controladores/registrados")

router.get("/", leer_tabla)

router.post("/", clave, crear_elemento)

router.put("/", clave, editar_elemento)

router.delete("/", borrar_elemento)

router.post("/ingresar", ingresar)

module.exports = router