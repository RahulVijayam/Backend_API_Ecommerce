const User = require('../models/User');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const sendEmail = require('./sendEmail')
const crypto = require('crypto') 

dotenv.config()
const secretKey = process.env.key;

/* User Registration */
const userRegister =  async (req, res) => {
  
    const { username, email, password, mobile } = req.body;
  
  try {
            const userEmail = await User.findOne({ email }); // This will return User details in  json format of  specific user 
                if (userEmail) {
                    //console.log(userEmail); 
                    console.log("User Already Exists");
                    return res.status(400).json({ error: "User Already Exist" });

                }

                


                const hashedpassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    username,
                    email,
                    password: hashedpassword,
                    mobile
                });

                await newUser.save();
                const token = await new Token({
                    userId: newUser._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save();
                const url = `${process.env.BASE_URL}user/${newUser._id}/verify/${token.token}`
                await sendEmail(newUser.email, "Verify Email", url);


                return res.status(201).json({ success: "User Registered Successfully, Please Verify Your Account " });
                console.log("Registered");
    } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" })
    }
            
 

}

const sentEmail = async (req, res) => {
   const user_login_token = req.headers.token;
    
    try {
       
        const decoded = jwt.verify(user_login_token,secretKey)    
        const user = await User.findById(decoded.userId);
        const token = await Token.findOne({ userId: user._id }); // Token for Email 

        const email = user.email;
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }
        else {
            if (!token) {
                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save();
            }
            else {
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
                await sendEmail(email, "Verify Email", url);
            }
           
        }

      
        return res.status(200).json({ success: "Email Sent Succesfully, Please check Inbox" });
    }
    catch (error) { 
        return res.status(500).json( error);
    }

}

const emailVerify = async (req, res) => {
    try {

        const uid = req.params.id;
        //console.log(uid)
        const user = await User.findOne({ _id: uid });
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });


        if (!user) {
            return res.status(400).json({ error: "Invalid Link" })
        }

        else if (!token) {
            return res.status(400).json({ error: "Invalid Link" })
        }
        else {
            //console.log(token)
            await User.findByIdAndUpdate({ _id: user._id },
                {
                    verified: true
                })
            // await token.remove() // remove() function is deprecated, now you may use deleteOne() or deleteMany() functions instead of that.
            await token.deleteOne()

            console.log("Email Verified Succesfully");
            return res.status(200).json({ success: "Email Verified Successfully" });

        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

/*User Login */
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const secretKey = process.env.key;

    try {
        const user = await User.findOne({ email });

        pass_check = await bcrypt.compare(password, user.password);

        if (!user || !pass_check) {
            return res.status(401).json({ error: "Invalid EmailId or Password" });
        }

        const token = await Token.findOne({ userId: user._id }); // Token for Email 

        if (!user.verified) {

            if (!token) {
                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save();
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
                await sendEmail(email, "Verify Email", url);


            }
            else {
                const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`
                await sendEmail(email, "Verify Email", url);
                //console.log("Email : ", email)
                //console.log("Token : ", token)

            }
            const token_jwt = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" })
            return res.status(200).json({ 
                    success: "Login Successful",
                    token_jwt, message: "An Email Sent to your acccount please verify", 
                    User : {
                        Name : user.username,
                        Email : user.email,
                        Mobile : user.mobile,
                        Verified:user.verified,Role:user.role 
                    } 
                })
        }
        else {
            // console.log(email)
            const token_jwt = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" })
          //  return res.status(200).json({ success: "Login Successful", token_jwt, user });
          return res.status(200).json({ 
            success: "Login Successful", 
            token_jwt,  
            User : {Name : user.username,Email : user.email,Mobile : user.mobile,Verified:user.verified,Role:user.role } 
        });

         
        }

    }


    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = { userRegister, userLogin, emailVerify, sentEmail };