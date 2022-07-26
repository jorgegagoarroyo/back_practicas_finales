const db = require("../database")

module.exports = {
    leer_tabla: (req, res)=>{
        // agregar wheres en funcion de lo que se pida en el body-------posible?
        
        //cambiar el ${} por un prepared statement
        db.execute(`SELECT * FROM ${req.params.tabla} `, (err, resul, fields)=>{
            if(err){
                res.status(500).json({"error_en_db": err})
            }
            res.json({resul})
        })
    },
    campos_tabla: (req, res)=>{
        //cambiar el ${} por un prepared statement
        db.execute(`DESCRIBE ${req.params.tabla} `, (err, resul)=>{
            if(err){
                res.status(500).json({"error_en_db": err})
            }
            res.json({resul})
        })
    },
    crear_elemento: (req, res)=>{
        res.send("crear elemento")
    },
    editar_elemento: (req, res)=>{
        res.send("editar elemento")
    },
    borrar_elemento: (req, res)=>{
        res.send("borrar elemento")
    }
}