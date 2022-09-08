// const db = require("../database")

// const tabla = "ufs"

// let fields 

// let otros_campos = ""
// let joins = ""
// lista_campos()




// async function lista_campos(){
//     let campos = await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
//             if(err){
//                 console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
//                 val = false
//             }
//             campos = resul
//             let temp = {}
//             //console.log(fields)
//             //fields = fields.map((i)=>{return `{ ${ i.Field}:${i.Type}}`})
//             campos.map((i)=> {
//                 let key = i.Field
//                 let value = i.Type
//                 temp[key] = value 
//                 //console.log(key, i.Type)
//             })
//             // console.log(temp)
//             fields = temp 

//             lista_tablas()
//         })
// }

// async function lista_tablas(act = tabla){
//     let temp = Object.keys(fields)
//     let re = /id_/
//     let otros = temp.filter( e => re.test(e))
//     //console.log("otros", otros)
//     temp.forEach( element =>{
//         otros_campos += `${tabla}.${element}, `
//     })
//     if(otros){
//         otros.map((e) =>{
//             let ele = e.split("_")
//             ele = ele[1]
//             joins += ` RIGHT JOIN ${ele} ON ${tabla}.${e} = ${ele}.id`
//             db.execute(`DESCRIBE ${ele} `, (err, resul)=>{
//                 if(err){
//                     console.log(`al leer los campos de la base de datos de la tabla ${ele} ocurrio un error : `,err)
//                     val = false
//                 }
//                 campos = resul
//                 temp = ""
//                 //console.log("campos", campos)
//                 campos.map((i)=> {
//                     if(!re.test(i)){
//                         //console.log(i)
//                         let key = i.Field
//                         //console.log("key ", key)
//                         temp += ` ${ele}.${key} AS ${ele}_${key},` 
//                     }//else{
//                     //     let tab = i.split("_")
//                     //     console.log(tab[1])
//                     //     lista_tablas(tab[1])
//                     // }
//                 })
//                 //console.log(temp)
//                 otros_campos += temp 
//             })  
//         })
//     }
//     //joins = joins.slice(0, -2)
// }

// module.exports = {

//     leer_tabla: async (req, res)=>{
//         let filtros = "" 
//         let values = []
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
//         console.log(otros_campos)
//         db.execute(`SELECT * FROM ${tabla} ${filtros}`,values, (err, resul)=>{       
//             if(err){
//                 res.status(500).json({"error_en_db": err})
//             }else{
//                 res.status(200).json({resul})
//             }
//         })
//     },

//     leer_tabla_todo: async (req, res)=>{
//         //console.log("fields ", fields)
//         console.log("joins ", joins)
//         let filtros = "" 
//         let values = []
//         let columnas = otros_campos.slice(0, -1)
//         let datos
//         //columnas += otros_campos
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
//         //console.log("leer")
//         //
        
//         console.log("otros campos", otros_campos)
//         db.execute(`SELECT ${columnas} FROM ${tabla} ${joins} ${filtros}`,values, (err, resul)=>{
//         // db.execute(`SELECT empleados.nombre AS emplados_nombre, roles.nombre AS rol FROM ${tabla} RIGHT JOIN roles ON id_roles = roles.id  ${filtros}`,values, (err, resul)=>{
//         // db.execute(`SELECT empleados.nombre AS emplados_nombre, roles.nombre AS rol FROM ${tabla} RIGHT JOIN roles ON id_roles = roles.id  ${filtros}`,values, (err, resul)=>{
//             if(err){
//                 res.status(500).json({"error_en_db": err})
//             }else{
//                 res.status(200).json({resul})
//             }
            
//             // res.send(`SELECT ${columnas} FROM ${joins} ${filtros}`)
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
//         console.log(typeof(id))
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