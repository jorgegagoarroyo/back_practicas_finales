const bd = require("../database")

const es_tutor = async ( req, res, next)=>{
    let act = req.query.token
    if( act.rol !="admin" || act.rol !="secretaria"){
        let value = req.body.campos
        value = [value.profesor]
        console.log(value)
        await  bd.execute("SELECT * FROM empleados WHERE id=?", value, (err, resul)=>{
            if (err){
                return res.status(500).json({mensaje:"error en tutor", err})
            }
            if(act.codigo == resul[0].codigo){
                next()
            }
            return res.status.json({mensaje:"no eres tutor"})
        })
    }
    next()

}

module.exports = es_tutor