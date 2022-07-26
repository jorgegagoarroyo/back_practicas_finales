const router = require("express").Router()
const { leer_tabla, crear_elemento, editar_elemento, borrar_elemento, campos_tabla } = require("../controladores/generico")

router.get("/:tabla", leer_tabla)

router.get("/:tabla/campos", campos_tabla)

router.post("/:tabla", crear_elemento)

router.put("/:tabla", editar_elemento)

router.delete("/:tabla", borrar_elemento)

module.exports = router