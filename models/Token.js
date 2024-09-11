const mongoose = require('mongoose')

const Schema=mongoose.Schema;

const tokenSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
        unique:true,
    },
    token:{
        type: String, 
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:360
    } // 1 Hour

});

const Token = mongoose.model('Token',tokenSchema)
module.exports = Token;