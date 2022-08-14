const router = require("express").Router()
const tokens = require("../middleware/token")
const auth = require("../middleware/auth")
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, campos_tabla, leer_tabla_todo } = require("../controladores/generico_joins")

router.get("/", leer_tabla)

router.get("/todo", leer_tabla_todo)

router.get("/campos", campos_tabla)

router.post("/", crear_elemento)

router.put("/", editar_elemento)

router.delete("/", borrar_elemento)

module.exports = router


// router.get("/test", tokens, auth(["test"]), leer_tabla)

// router.get("/:tabla", leer_tabla)

// router.get("/:tabla/campos", campos_tabla)

// router.post("/:tabla", crear_elemento)

// router.put("/:tabla", editar_elemento)

// router.delete("/:tabla", borrar_elemento)