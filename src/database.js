const mysql = require("mysql2")
require("dotenv").config()

try{
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    })
    console.log("conectado a la base de datos SQL")
}catch(err){
    console.log("error en la conexion con la base de datos ", err)
}

module.exports = connection