const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const secretKey = process.env.key;
const verifyToken = async(req,res,next)=>{
    const token = req.headers.token; 

    if(!token){
        return res.status(401).json({error :"Access Denied"})
    }
    try {
        const decoded = jwt.verify(token,secretKey)      // this will decode our token which consists of {UserId:user._id}
        const user = await User.findById(decoded.userId); 
        if(!user)
        {
            return res.status(404).json({error:"User Not Found"})
        }
        
        //console.log(decoded)
        req.userId = user._id;
        //return res.status(200).json({ authStatus:true, user}) 

        return res.status(200).json({ IsTokenValid:true, User : {Name : user.username,Email : user.email,Mobile : user.mobile,Verified:user.verified } })

        
        
        
    }
    catch(error){

        console.log(error)
        return res.status(401).json({error})
        
    }
}

module.exports = verifyToken;