const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const db = require("../database")
require("dotenv").config()

const tabla = "empleados"
let fields
lista_campos()

async function lista_campos(){
    await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
            if(err){
                console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
                fields = false
            }
            fields = resul
            let temp = {}
            fields.map((i)=> {
                let key = i.Field
                let value = i.Type
                temp[key] = value 
            })
            fields = temp  
        })
}

module.exports = {

leer_tabla: async (req, res)=>{
    let filtros = "" 
    let values = []
    let columnas = "*"
    let datos
    if(req.body.campos){
        datos = req.body.campos
        let temp = Object.keys(datos)  
        filtros = "WHERE " 
        await temp.forEach(element => {
            if(fields[element]){ 
                //
                //cambiar el igual(=) en funcion de la busqueda a realizar y el AND
                //
                filtros += `${element}=? AND ` 
                values.push(datos[element]) 
            }
        })
        filtros = filtros.slice(0, -4)
    }
    db.execute(`SELECT ${columnas} FROM ${tabla} ${filtros}`,values, (err, resul)=>{
        if(err){
            res.status(500).json({"error_en_db": err})
        }
        res.status(200).json({resul})
    })
},

campos_tabla: async (req, res)=>{
        if(!fields){
            res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
        }else{
            res.status(200).json({fields})
        }
},

crear_elemento: async (req, res)=>{
    try{
        if(!req.body.campos){
            throw "no hay datos de usuario"
        }
        let datos = req.body.campos
        let temp = []
        let query = ""
        let values = ""
        temp = Object.keys(datos)
        if(datos.pass){
                temp.forEach(element => {
                    if(fields[element]  && element != "id" && element != "pass"){
                        query += ` ${element},`
                        // cambios para elementos que sean tipo int o date
                        if(fields[element].indexOf("int") != -1 || fields[element].indexOf("date") != -1){
                            values += datos[element]
                            values += ","
                        }else{
                            values += ` '${datos[element]}',`
                        }
                    }
                    if(element == "pass"){
                        query += ` ${element},`
                        values += ` '${req.query.pass}',`
                    }
                })
                query = query.slice(0, -1)
                values = values.slice(0, -1)
                //cambiar el prepared statement???
                db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`, (err, resul)=>{
                    if(err){
                        res.status(500).json({"mensaje de error en insert ":err})
                    }else{
                        res.status(200).json({mensaje:`elemento agregado`})
                    }
                })
        }else{
            return res.status(500).json({mensaje: "contraseña necesarios"})
        }
    }catch(err){
        res.status(500).json({err, mensaje:"error en crear registro"})
    }
},

editar_elemento: async (req, res)=>{
    try{
        let datos = req.body.campos
        let temp = []
        let query = ""
        let values = []
        let id =datos.id // tal vez cambiar a futuro
        if(!id){
            throw "hace falta el id"
        }
        temp = Object.keys(datos)
        temp.forEach(element => {
            if(fields[element]  && element != "id" && element != "pass"){
                query += ` ${element} =?,`
                values.push(datos[element])
            }
            if(element == "pass"){
                query += ` ${element} =?,`
                values.push(req.query.pass)  
            }
        })
        values.push(id)
        query = query.slice(0, -1)
        console.log(`UPDATE ${tabla} SET ${query} WHERE id=?`, values)
        db.execute(`UPDATE ${tabla} SET ${query} WHERE id=?`, values , (err, resul)=>{
            if(err){
                res.status(500).json({"mensaje de error en update ":err})
            }else{
                res.status(200).json({mensaje:`elemento editado`})
            }
        })
    }catch(err){
        res.status(500).json({
            mensaje:"error en la edicion",
            err
        })
    }
},

borrar_elemento: (req, res)=>{
    let seleccion = req.body.campos
    seleccion = seleccion.id
    db.execute(`DELETE FROM ${tabla} WHERE id = ?`, seleccion, (err, resul)=>{
        if(err){
            return res.status(500).json({"error_en_delete: ": err})
        }
        return res.status(200).json({mensaje:"elemento eliminado"})      
    })
},

ingresar: async (req, res)=>{
    try{
        let email_user = req.body.campos.email
        let user
        let log_in = false 
        await db.execute(`SELECT *, roles.nombre AS rol  FROM ${tabla} LEFT JOIN roles ON id_roles = roles.id WHERE email=?`, [email_user], (err, resul)=>{
            console.log("en db")
            if(err){ 
                throw err
            }
            user = resul[0]
            //console.log(user) 
            //res.send("ok")
            bcrypt.compare( req.body.campos.pass, user.pass,  (err, result)=>{
                if(err){
                    throw err
                }
                log_in = result
                // console.log({"rol":user.rol,
                //     "codigo":user.codigo,
                //     "usuario":user.usuario}) 
                // res.json({log_in})
                let token = jwt.sign({ 
                    "rol":user.rol,
                    "codigo":user.codigo,
                    "usuario":user.usuario
                },
                process.env.SECRETO)//agregar segundo token y expiracion
                res.status(200).json({token})
            })
        })
    }catch(err){
        res.status(500).json({mensaje:"error en ingreso de datos", err})
    }
}
} 

// try{
//     if(!req.body.campos){
//         throw "no hay datos de usuario"
//     }
//     let datos = req.body.campos
//     let temp = []
//     let query = ""
//     let values = ""
//     temp = Object.keys(datos)
//     if(datos.pass){
//         await bcrypt.hash(datos.pass, 10, (err, hash)=>{
//             if(err){
//                 throw err
//             }
//             datos.pass = hash
//             temp.forEach(element => {
//                 if(fields[element]  && element != "id"){
//                     query += ` ${element},`
//                     // cambios para elementos que sean tipo int o date
//                     if(fields[element].indexOf("int") != -1 || fields[element].indexOf("date") != -1){
//                         values += datos[element]
//                         values += ","
//                     }else{
//                         values += ` '${datos[element]}',`
//                     }
//                 }
//             })
//             query = query.slice(0, -1)
//             values = values.slice(0, -1)
//             //cambiar el prepared statement???
//             db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`, (err, resul)=>{
//                 if(err){
//                     res.status(500).json({"mensaje de error en insert ":err})
//                 }else{
//                     res.status(200).json({mensaje:`elemento agregado`})
//                 }
//             })
//         })
//     }else{
//         return res.status(500).json({mensaje: "contraseña necesarios"})
//     }
// }catch(err){
//     res.status(500).json({err, mensaje:"error en crear registro"})
// }



// editar_elemento: async (req, res)=>{
//     try{

//         console.log("editando")

//         let datos = req.body.campos
//         let temp = []
//         let query = ""
//         let values = []
//         let id = 5 //req.query.id
//         temp = Object.keys(datos)

//         console.log("temp creado")

//         // if(clave(datos[pass], id)){
//         //     console.log("in if")
//         // }else{
//         //     console.log("in else")
//         //     throw "error en clave"
//         // }

//         console.log("for each")

//         temp.forEach(element => {
//             if(fields[element]  && element != "id" && element != "pass"){
//                 query += ` ${element} =?,`
//                 values.push(datos[element])
//             }
//             if(element == "pass"){
//                 query += ` ${element} =?,`
//                 values.push(req.query.pass)
//             }
//         })
//         query = query.slice(0, -1)

//         console.log(`UPDATE ${tabla} SET ${query} WHERE ${id}`, values)
//         res.send("ok")
//         // db.execute(`UPDATE ${tabla} SET ${query} WHERE ${id}`, values , (err, resul)=>{
//         //     if(err){
//         //         res.status(500).json({"mensaje de error en update ":err})
//         //     }else{
//         //         res.status(200).json({mensaje:`elemento editado`})
//         //     }
//         // })
//     }catch(err){
//         res.status(500).json({
//             mensaje:"error en la edicion",
//             err
//         })
//     }
// }



// async function clave(pass, id_e){
//     try{
//         console.log("clave")
//         let id = id_e
//         await bcrypt.hash(pass, 10, (err, hash)=>{
//             if(err){
//                 console.log(err)
//                 throw err
//             }
//             console.log(hash)
//             db.execute(`UPDATE ${tabla} SET pass=? WHERE ${id}`, hash, (err, result)=>{
//                 if(err){
//                     console.log(err)
//                     throw err
//                 }
//                 console.log(result)
//             }) 
//         })
//         console.log(pass)
//         return true
//     }catch(err){
//         return false
//     }

// }
