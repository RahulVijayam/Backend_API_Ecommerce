const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const secretKey = process.env.key;
const verifyAdmin = async(req,res,next)=>{
    const token = req.headers.token;

    if(!token){
        return res.status(401).json({error :"Access Denied"})
    }
    try {
        const decoded = jwt.verify(token,secretKey)      // this will decode our token which consists of {vendorId:vendor._id}
        const user = await User.findById(decoded.userId); 
        if(!user)
        {
            return res.status(404).json({error:"User Not Found"})
        }

        if(user.role=='admin'){
            return res.status(200).json({status:true,user})
        }
        else {
            return res.status(401).json({error:"UnAuthorized Access"})
        }
        
        
    }
    catch(error){

        console.log(error)
        return res.status(401).json({error})
        
    }
}

module.exports = verifyAdmin;