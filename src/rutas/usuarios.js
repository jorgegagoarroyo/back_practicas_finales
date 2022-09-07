const express = require("express")
const router = express.Router()
const clave = require("../middleware/clave")
const tokens = require("../middleware/token")
const auth = require("../middleware/auth")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, ingresar, campos_tabla } = require("../controladores/registrados")

const tutor = require("../middleware/tutor")
const token = require("../middleware/token")

router.post("/get", tokens,auth(["secretaria", "profesor"]), leer_tabla)

router.get("/campos", tokens, auth(["secretaria", "profesor"]), campos_tabla)

router.post("/", tokens, auth(["secretaria"]), clave, crear_elemento)

router.put("/",tokens, clave, editar_elemento)

router.delete("/", tokens, auth(), borrar_elemento)

router.post("/ingresar", ingresar)

module.exports = router