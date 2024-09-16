const express = require('express')
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());
const validateInput = (req,res,next)=>{
    body("username").notEmpty();
    body("email").isEmail();
    body("password").notEmpty();
  
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else
    {
        next()
        //return res.status(200).json({"ok":"data" })
    }
}

module.exports=validateInput;