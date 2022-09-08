const db = require("../database")
const tabla = "fechas"

let fields 
let otros_campos = ""
let joins = ""
lista_campos()

async function lista_campos(){
    try{
        let campos = await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
            if(err){
                console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
                val = false
            }
            campos = resul
            let temp = {}
            campos.map((i)=> {
                let key = i.Field
                let value = i.Type
                temp[key] = value 
            })
            fields = temp 
            lista_tablas()
        })
    }catch(err){
        console.log(`error en lista_campos en la tabla ${tabla}`)
    }
}

async function lista_tablas(act = tabla){
    try{
        let temp = Object.keys(fields)
    let re = /id_/
    let otros = temp.filter( e => re.test(e))
    temp.forEach( element =>{
        otros_campos += `${tabla}.${element}, `
    })
    if(otros){
        otros.map((e) =>{
            let ele = e.split("_")
            ele = ele[1]
            joins += ` RIGHT JOIN ${ele} ON ${tabla}.${e} = ${ele}.id`
            db.execute(`DESCRIBE ${ele} `, (err, resul)=>{
                if(err){
                    console.log(`al leer los campos de la base de datos de la tabla ${ele} ocurrio un error : `,err)
                    val = false
                }
                campos = resul
                temp = ""
                campos.map((i)=> {
                    if(!re.test(i)){
                        let key = i.Field
                        temp += ` ${ele}.${key} AS ${ele}_${key},` 
                    }
                })
                otros_campos += temp 
            })  
        })
    }
    //joins = joins.slice(0, -2)
    }catch(err){
        console.log(`erroe en lista_tablas en tabla ${act}`)
    }
}

module.exports = {
    leer_tabla: async (req, res)=>{
        try{
            let filtros = "" 
        let values = []
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
        // console.log(otros_campos)
        db.execute(`SELECT * FROM ${tabla} ${filtros}`,values, (err, resul)=>{       
            if(err){
                res.status(500).json({"error_en_db": err})
            }else{
                res.status(200).json({resul})
            }
        })
        }catch(err){ 
            res.status(err).json({mensaje:"erroe en todo", err})
        }
    },

    leer_tabla_todo: async (req, res)=>{
        try{
            console.log("joins ", joins)
        let filtros = "" 
        let values = []
        let columnas = otros_campos.slice(0, -1)
        let datos
        if(req.body.campos){
            datos = req.body.campos
            let temp = Object.keys(datos)  
            filtros = "WHERE " 
            await temp.forEach(element => {
                if(fields[element]){ 
                    filtros += `${tabla}.${element}=? AND ` 
                    values.push(datos[element]) 
                }
            })
            filtros = filtros.slice(0, -4)
        } 
        console.log("otros campos", otros_campos)
        db.execute(`SELECT ${columnas} FROM ${tabla} ${joins} ${filtros}`,values, (err, resul)=>{
            if(err){
                res.status(500).json({"error_en_db": err})
            }else{
                res.status(200).json({resul})
            }
        })
        }catch(err){
            res.status(500).json({mensaje:"erro en tablas ", err})
        }
    },

    campos_tabla: async (req, res)=>{
        try{
            if(!fields){
                res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
            }else{
                res.status(200).json({fields})
            }
        }catch(err){
            res.status(500).json({mensaje:"erro en campos tabla", err})
        }
    },

    crear_elemento: async (req, res)=>{
        try{
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
        // console.log(values)
        db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`, (err, resul)=>{
            if(err){
                console.log('error insert fecha ', err)
                res.status(500).json({"mensaje de error en insert ":err})
            }else{
                res.status(200).json({mensaje:`elemento agregado`})
            }
        })
        }catch(err){
            res.status(500).json({mensaje:"error en crear ", err})
        }
    },

    editar_elemento: async (req, res)=>{
        try{
            let datos = req.body.campos
        let temp = []
        let query = ""
        let values = []
        //id desde un middleware 
        let id = datos.id
        console.log(typeof(id))
        if(typeof(id) != "number"){
            throw "error en id type"
        }
        id = ` id=${id}`
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
        }
        catch(err){
            res.status(500).json({mensaje:"error al editar", err})
        }
    },

    borrar_elemento: (req, res)=>{
        try{
            let seleccion = req.body.campos
        seleccion = seleccion.id
        db.execute(`DELETE FROM ${tabla} WHERE id = ?`, [seleccion], (err, resul)=>{
            if(err){
                return res.status(500).json({"error_en_delete: ": err})
            }
            return res.status(200).json({mensaje:"elemento eliminado"})  
        })
        }catch(err){
            res.status(500).json({mensaje:"error en eliminacion ", err})
        }
    }
} 