const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String, 
        required:true
    },
    email:{
        type:String,
        required:true,  
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:
    {
        type:String, 
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:'user'
       
    }

})


const User = mongoose.model('User',userSchema)

module.exports = User;
