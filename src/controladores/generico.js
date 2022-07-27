const db = require("../database")

const tabla = "alumnos"

let fields = lista_campos()

async function lista_campos(){
    await db.execute(`DESCRIBE ${tabla} `, (err, resul)=>{
            if(err){
                console.log(`al leer los campos de la base de datos de la tabla ${tabla} ocurrio un error : `,err)
                fields = false
            }
            fields = resul
            //console.log(fields)
            fields = fields.map((i)=>{return `{ ${ i.Field}:${i.Type}}`})
            console.log(fields)
          
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
            if(!fields){
                res.status(500).json({mensaje : `error al leer los campos en la tabla ${tabla}`})
            }else{
                res.status(200).json({fields})
            }
    },
    crear_elemento: async (req, res)=>{
        let datos = req.body.campos
        let temp = []
        let query = ""
        let values = []


        temp = Object.keys(datos)

        //console.log("temp "+ temp )

        await temp.forEach(element => {
            console.log("elemento ", element)
            if(fields.includes(element)){
                console.log(datos[element])
                query += ` ${element},`
                if(fields.element[1] != "INT" || fields.element[1] != "DATE"){
                    values += ` '${datos[element]}',`
                }else{
                    values += ` ${datos[element]},`
                }
            }
        })
        query = query.slice(0, -1)
        values = values.slice(0, -1)
            
        console.log("query ", query)
        console.log("values ",values)
        //console.log("fields ",fields)
        res.json({mensaje:`INSERT INTO ${tabla} (${query}) VALUES (${values})`})

        //cambiar el prepared statement???
        db.execute(`INSERT INTO ${tabla} (${query}) VALUES (${values})`)
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


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //base para cambiar los prepared statements segun los campos pasados en la peticion y los campos de la tabla

    // name: (req, res)=>{
    //     let datos = req.body.campos
    //     let temp = []
    //     let query = ""
    //     let values = []


    //     temp = Object.keys(datos)

    //     //console.log("temp "+ temp )

    //     temp.forEach(element => {
    //         //console.log("elemento ", element)
    //         if(fields.includes(element)){
    //             console.log(datos[element])
    //             query += `${element}=?,`
    //             values.push(datos[element])

    //         }
    //     })
            
        

    //     // console.log("query ", query)
    //     // console.log("values ",values)
    //     // console.log("fields ",fields)
    //     res.json({mensaje:"ok"})
