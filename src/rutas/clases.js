const router = require("express").Router()
const tokens = require("../middleware/token")
const auth = require("../middleware/auth")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, campos_tabla, leer_tabla_todo } = require("../controladores/clases")

router.post("/get", tokens, auth(["secretaria", "profesor"]), leer_tabla)

router.get("/todo", tokens, auth(["secretaria"]), leer_tabla_todo)

router.get("/campos", tokens, auth(["secretaria", "profesor"]), campos_tabla)

router.post("/", tokens, auth(["secretaria"]), crear_elemento)

router.put("/", tokens, auth(["secretaria"]), editar_elemento)

router.delete("/", tokens, auth(["secretaria"]), borrar_elemento)

module.exports = router
