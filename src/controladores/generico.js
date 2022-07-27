const db = require("../database")

const tabla = "empleados"

let campos = lista_campos()

async function lista_campos(){
    await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
            if(err){
                console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
                campos = false
            }
            campos = resul
            campos = campos.map((i)=>{return i.Field})  
        })
    
}

module.exports = {
    leer_tabla: (req, res)=>{
        // agregar wheres en funcion de lo que se pida en el body 
        db.execute(`SELECT * FROM ${tabla} `, (err, resul)=>{
            if(err){
                res.status(500).json({"error_en_db": err})
            }
            res.status(200).json({resul})
        })
    },
    campos_tabla: async (req, res)=>{
            if(!campos){
                res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
            }else{
                res.status(200).json({campos})
            }
    },
    crear_elemento: (req, res)=>{
        db.execute(`INSERT INTO ${tabla}`)
    },
    editar_elemento: (req, res)=>{
        res.send("editar elemento")
    },
    borrar_elemento: (req, res)=>{
        res.send("borrar elemento")
    }
} 


 // campos_tabla: (req, res)=>{
    //     db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
    //         if(err){
    //             res.status(500).json({err})
    //         }else{
    //             res.status(200).json({resul})
    //         }
    //     })
    // },