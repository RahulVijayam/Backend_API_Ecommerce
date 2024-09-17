const express = require('express')
const userController = require('../controllers/userController')
const authStatus = require('../controllers/userController')
const verifyToken=require('../middlewares/verifyToken')
const verifyAdmin=require('../middlewares/verifyAdmin')
const sentEmail = require('../controllers/sendEmail') 
const validateInput = require('../middlewares/validateInput')
const router = express.Router()


router.post('/add', userController.userRegister);
router.post('/login',userController.userLogin);
router.get('/verifytoken/',verifyToken)
router.get('/verifyadmin/',verifyAdmin)
router.get('/sentEmail/',userController.sentEmail)

router.get('/:id/verify/:token/',userController.emailVerify)
module.exports=router;