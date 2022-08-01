const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const db = require("../database")
require("dotenv").config()

module.exports={

nuevo_usuario: async(req, res)=>{
    let datos = req.body.campos
    let temp = Object.keys(datos)

    datos[pass] = await bcrypt.hash(datos[pass], 10)

    db.execute(`INSERT INTO empleados ( dni, nombre, apellido1, apellido2, email, imagen, id_rol, usuario, pass, codigo) VALUES (${datos[dni]}, ${datos[nombre]}), ${datos[apellido1]}, ${datos[apellido2]}, ${datos[email]}, ${datos[imagen]}, ${datos[id_rol]}, ${datos[usuario]}, ${datos[pass]}, ${datos[codigo]}`, (err, resul)=>{
        if(err){
            res.status(500).json({
                mensaje: "error al crear usuario",
                err
            })
        }else{
            res.status(200).json({
                mensaje: "usuario creado"
            })
        }
    })
},

editar_usuario: async(req, res)=>{

    //en midlledware se obtiene id del usuario a editar
    let datos = req.body.campos
    let temp = Object.keys(datos)
    let id = req.query.id

    datos[pass] = await bcrypt.hash(datos[pass], 10)
    db.execute(`UPDATE  empleados SET dni=?, nombre=?, apellido1=?, apellido2=?, email=?, imagen=?, id_rol=?, usuario=?, pass=?, codigo=? WHERE id=?`, [datos[dni], datos[nombre], datos[apellido1], datos[apellido2], datos[email], datos[imagen], datos[id_rol], datos[usuario], datos[pass], datos[codigo], id], (err, resul)=>{
        if(err){
            res.status(500).json({
                mensaje: "error al editar usuario",
                err
            })
        }else{
            res.status(200).json({
                mensaje: "usuario editado"
            })
        }
    })
},

leer_usuarios: (req,res)=>{},

leer_usuario_id: (req, res)=>{},

borrar_usuario: (req, res)=>{},

ingresar_usuario: (req, res)=>{}

}