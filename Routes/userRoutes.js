const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")



userRoutes.get('/',userController.userHome)

userRoutes.get('/loginpage', userController.signupLoginPage )

userRoutes.post('/signup', userController.signup )
// userRoutes.post('/signup',userController.checkUser);
// userRoutes.get('/signup', userController.userSignup)




module.exports = userRoutes