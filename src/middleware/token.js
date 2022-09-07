const jwt = require("jsonwebtoken")
require("dotenv").config()

val_token= async (req, res, next)=>{
    try{
        //console.log("token")
        let val = req.headers.authorization
        val = val.split(" ")
        val = val[1]
        //console.log(val)
        // val = await jwt.verify( val, process.env.SECRETO)
        // //console.log(val)
        // req.query.token = val
        //console.log(req.query.token)
        req.query.token = await jwt.verify( val, process.env.SECRETO)
        next()
    }catch(err){
        console.log('error token')
        res.status(500).json({
            mensaje:"error en server token",
            err
        })
    }
}

module.exports = val_token