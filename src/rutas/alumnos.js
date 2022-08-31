const router = require("express").Router()
const tokens = require("../middleware/token")
const auth = require("../middleware/auth")
const tutor = require("../middleware/tutor")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, campos_tabla } = require("../controladores/alumnos")

// router.get("/", tokens, auth(["secretaria", "profesor"]), tutor, leer_tabla)

// router.get("/campos", tokens, auth(["secretaria", "profesor"]), tutor, campos_tabla)

// router.post("/", tokens, auth(["secretaria", "profesor"]), tutor, crear_elemento)

// router.put("/", tokens, auth(["secretaria", "profesor"]), tutor, editar_elemento)

// router.delete("/", tokens, auth(["secretaria"]), borrar_elemento)


router.post("/get", leer_tabla)

router.get("/campos", campos_tabla)

router.post("/", crear_elemento)

router.put("/", editar_elemento)

router.delete("/", borrar_elemento)

module.exports = router 
