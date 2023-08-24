const jwt = require('jsonwebtoken')
require('dotenv').config()
const auth = (req,res,next)=>{
    try {
        const token = req.headers?.authorization
        let decoded = jwt.verify(token,process.env.tokenkey)
        if(decoded){
            next()
            return
        }
        return res.status(404).send({msg : "Unauthorized!", isOk : false})
    } catch (error) {
        console.log(error)
        return res.status(401).send({msg :"Something went wrong !", isOk : false, error : error})
    }
}


module.exports ={auth}