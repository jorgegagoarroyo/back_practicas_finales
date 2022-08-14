const db = require("../database")

const tabla = "aulas"

let fields = lista_campos()

async function lista_campos(){
    try{
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
    }catch(err){
        console.log(`error en lista_campos en tabla ${tabla}`)
    }
}

module.exports = {
    leer_tabla: async (req, res)=>{
        try {
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
                        filtros += `${element}=? AND ` 
                        values.push(datos[element]) 
                    }
                })
                filtros = filtros.slice(0, -4)
            }
            await db.execute(`SELECT ${columnas} FROM ${tabla} ${filtros}`,values, (err, resul)=>{
                if(err){
                    throw  err
                }
                return res.status(200).json({resul})
            })
        } catch (err) {
            res.status(500).json({mensaje:`error en leer `, err})
        }
    },

    campos_tabla: async (req, res)=>{
        try {
            if(!fields){
                res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
            }else{
                res.status(200).json({fields})
            }
        } catch (err) {
            res.status(500).json({mensaje:`error en campos`, err})
        }
    },

    crear_elemento: async (req, res)=>{
        try {
            let datos = req.body.campos
            let temp = []
            let query = ""
            let values = ""
            temp = Object.keys(datos)
            await temp.forEach(element => {
                if(fields[element]  && element != "id"){
                    query += ` ${element},`
                    if(fields[element].indexOf("int") != -1 || fields[element].indexOf("date") != -1){
                        values += datos[element]
                        values += ","
                    }else{
                        values += ` '${datos[element]}',`
                    }
                }
            })
            query = query.slice(0, -1)
            values = values.slice(0, -1)   
            db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`, (err, resul)=>{
                if(err){
                    res.status(500).json({"mensaje de error en insert ":err})
                }else{
                    res.status(200).json({mensaje:`elemento agregado`})
                }
            })
        } catch (err) {
            res.status(500).json({mensaje:`error en crear`, err})
        }
    },

    editar_elemento: async (req, res)=>{
        try {
            let datos = req.body.campos
            let temp = []
            let query = ""
            let values = []
            let id = datos.id
            if(typeof(id) != "number"){
                throw "tipo de id no valido"
            }
            id = `id = ${id}`
            temp = Object.keys(datos)
            await temp.forEach(element => {
                if(fields[element]  && element != "id"){
                    query += ` ${element} =?,`
                    values.push(datos[element])
                }
            })
            query = query.slice(0, -1)
            db.execute(`UPDATE ${tabla} SET ${query} WHERE ${id}`, values , (err, resul)=>{
                if(err){
                    res.status(500).json({"mensaje de error en update ":err})
                }else{
                    res.status(200).json({mensaje:`elemento editado`})
                }
            })
        } catch (err) {
            res.status(500).json({mensaje: `error en editar `, err})
        }
    },

    borrar_elemento: (req, res)=>{
        try {
            let seleccion = req.body.campos
            seleccion = seleccion.id
            db.execute(`DELETE FROM ${tabla} WHERE id = ?`, [seleccion], (err, resul)=>{
                if(err){
                    return res.status(500).json({"error_en_delete: ": err})
                }
                return res.status(200).json({mensaje:"elemento eliminado"})  
            })
        } catch (err) {
            res.status(500).json({mensaje: "error en eliminar ", err})
        }
    }
} 














// let fields = lista_campos()

// async function lista_campos(){
//     await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
//             if(err){
//                 console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
//                 fields = false
//             }
//             fields = resul
//             let temp = {}
//             //console.log(fields)
//             //fields = fields.map((i)=>{return `{ ${ i.Field}:${i.Type}}`})
//             fields.map((i)=> {
//                 let key = i.Field
//                 let value = i.Type
//                 temp[key] = value 
//                 //console.log(key, i.Type)
//             })
//             //console.log(temp)
//             fields = temp 
//             //console.log(fields)
          
//         })
// }

// module.exports = {

//     leer_tabla: async (req, res)=>{
//         let filtros = "" 
//         let values = []
//         let columnas = "*"
//         let datos
//         if(req.body.campos){
//             datos = req.body.campos
//             let temp = Object.keys(datos)  
//             filtros = "WHERE " 

//             await temp.forEach(element => {
//                 if(fields[element]){ 
//                     //
//                     //cambiar el igual(=) en funcion de la busqueda a realizar y el AND
//                     //
//                     filtros += `${element}=? AND ` 
//                     values.push(datos[element]) 
//                 }
//             })
//             filtros = filtros.slice(0, -4)
//         }

        
//         // agregar wheres en funcion de lo que se pida en el body
//         db.execute(`SELECT ${columnas} FROM ${tabla} ${filtros}`,values, (err, resul)=>{
//             if(err){
//                 res.status(500).json({"error_en_db": err})
//             }
//             res.status(200).json({resul})
//         })
//     },

//     campos_tabla: async (req, res)=>{
//             if(!fields){
//                 res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
//             }else{
//                 res.status(200).json({fields})
//             }
//     },

//     crear_elemento: async (req, res)=>{
//         let datos = req.body.campos
//         let temp = []
//         let query = ""
//         let values = ""

//         temp = Object.keys(datos)
//         //console.log("temp "+ temp )

//         await temp.forEach(element => {
//             //console.log("elemento ", element) 
//             if(fields[element]  && element != "id"){
//                 //console.log("in ",datos[element])
//                 query += ` ${element},`
//                 // cambios para elementos que sean tipo int o date
//                 if(fields[element].indexOf("int") != -1 || fields[element].indexOf("date") != -1){
//                     values += datos[element]
//                     values += ","
//                 }else{
//                     //console.log("no int no date")
//                     values += ` '${datos[element]}',`
//                 }
//             }
//         })
//         query = query.slice(0, -1)
//         values = values.slice(0, -1)
            
//         // console.log("query ", query)
//         // console.log("values ",values)
//         //console.log("fields ",fields)
//         // res.json({mensaje:`INSERT INTO ${tabla} (${query}) VALUES (${values})`})

//         //cambiar el prepared statement???
//         db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`, (err, resul)=>{
//             if(err){
//                 res.status(500).json({"mensaje de error en insert ":err})
//             }else{
//                 res.status(200).json({mensaje:`elemento agregado`})
//             }
//         })
//     },

//     editar_elemento: async (req, res)=>{
//         let datos = req.body.campos
//         let temp = []
//         let query = ""
//         let values = []
//         //id desde un middleware 
//         let id = datos.id
//         temp = Object.keys(datos)
//         await temp.forEach(element => {
//             if(fields[element]  && element != "id"){
//                 query += ` ${element} =?,`
//                 values.push(datos[element])
//             }
//         })
//         query = query.slice(0, -1)
//         db.execute(`UPDATE ${tabla} SET ${query} WHERE ${id}`, values , (err, resul)=>{
//             if(err){
//                 res.status(500).json({"mensaje de error en update ":err})
//             }else{
//                 res.status(200).json({mensaje:`elemento editado`})
//             }
//         })
//     },
//     borrar_elemento: (req, res)=>{
//         let seleccion = req.body.campos
//         seleccion = seleccion.id
//         db.execute(`DELETE FROM ${tabla} WHERE id = ?`, [seleccion], (err, resul)=>{
//             if(err){
//                 return res.status(500).json({"error_en_delete: ": err})
//             }
//             return res.status(200).json({mensaje:"elemento eliminado"})  
//         })

//     }
// } 