const router = require("express").Router()
const tokens = require("../middleware/token")
const auth = require("../middleware/auth")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, campos_tabla, leer_tabla_todo } = require("../controladores/generico_joins")

router.post("/get", tokens, auth(), leer_tabla)

router.get("/todo", tokens, auth(), leer_tabla_todo)

router.get("/campos", tokens, auth(), campos_tabla)

router.post("/", tokens, auth(), crear_elemento)

router.put("/", tokens, auth(), editar_elemento)

router.delete("/", tokens, auth(), borrar_elemento)

module.exports = router


// router.get("/test", tokens, auth(["test"]), leer_tabla)

// router.get("/:tabla", leer_tabla)

// router.get("/:tabla/campos", campos_tabla)

// router.post("/:tabla", crear_elemento)

// router.put("/:tabla", editar_elemento)

// router.delete("/:tabla", borrar_elemento)