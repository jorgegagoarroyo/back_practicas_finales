const bcrypt = require("bcrypt")

clave_hash = (req, res, next)=>{
    let datos = req.body.campos
    if (datos.pass){
        bcrypt.hash(datos.pass, 10, (err, hash)=>{
            if(err){
               return res.json({mensaje: "problemas con la contaseña"})
            }
            req.query.pass = hash
            next()
        })
    }else{ 
        console.log("no pass")
        next()
    }
}

module.exports = clave_hash