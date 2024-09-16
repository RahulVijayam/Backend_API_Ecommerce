const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const ejs = require('ejs')
 

const app = express()
dotenv.config();
app.use(cors())
app.use(bodyParser.json())  /// looks at requests where the Content-Type header matches the type option
 
app.set('view engine', 'ejs')  // For Returning HTML page as a response from the server.


/*MongoDB and Server Code Start */
    const PORT = 80;
    const mongo_uri = process.env.MONGO_URI
    mongoose.connect(mongo_uri)
        .then(() => console.log("MongoDB Connected Succesfully!"))
        .catch((error) => console.log(error))

    app.listen(PORT, () => {
        console.log(`Server Started and Running at ${PORT}`)
    })
/*MongoDB and Server Code End */
 
 
app.use('/user', userRoutes);

//Client Side Rendering
app.use('/home', (req, res) => {
    res.json("<p>Message From Client Side</p><h1>Welcome to Ecommerce BackEnd API,</h1><p>Developed using Node.js and Express Framework </p>");
})


 
//Server Side Rendering
app.use('/login', (req, res) => {
    res.render('login');
})
app.use('/', (req, res) => {
    res.render('samplePage');
})

