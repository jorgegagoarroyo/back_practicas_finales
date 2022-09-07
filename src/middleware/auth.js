//permite el paso segun el rol

auth = (pasan = [])=>{
    //let roles = pasan 
    return (req, res, next)=>{
        try{
            let act = req.query.token
            //console.log(act)
            act = act.rol
            // console.log(act)
            // console.log(pasan)
            // console.log(pasan.includes(act))
            //console.log(act == "admin")
            if( act == "admin" || pasan.includes(act)){
                next()
            }else{
                console.log('auth')
                res.status(500).json({
                    mensaje:"error en rol no puedes pasar"
                })
            }
        }catch(err){
            console.log('error en auth')
            res.status(500).json({
                mensaje:"error en rol",
                err
            })
        }
    }
}

module.exports = auth