const bd = require("../database")

const prof_uf = async ( req, res, next)=>{
    try {
        let act = req.query.token
        act = act.rol
        if( act !="admin" && act !="secretaria"){
            console.log('es prof')
            let value = req.body.campos
            value = [value.ufs]
            await  bd.execute("SELECT * FROM horarios WHERE id_ufs=? ", value, (err, resul)=>{
                if (err){
                    return res.status(500).json({mensaje:"error en tutor", err})
                }
                res = resul.filter(respon => respon.id_empleados == value.empleado )
                //
                console.log(res)
                //
                if(res){ 
                    next()
                }
                return res.status(400).json({mensaje:"no eres profesor de esta uf"})
            })
        } 
        next()
    } catch (err){
        console.log('prof')
        res.status(500).json({mensaje:"error en tutor ", err})
    }
}

module.exports = prof_uf