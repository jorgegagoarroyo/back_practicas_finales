const bcrypt = require("bcrypt")

clave_hash = (req, res, next)=>{
    try {
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
    } catch (err) {
        res.status(500).json({mensaje: "error en clave"})
    }
}

module.exports = clave_hash