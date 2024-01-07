const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")
const userAuth=require('../Authentication.js/userAuth.js')

const path = require('path');



// userRoutes.set('view engine', 'ejs');
// userRoutes.set('views', './views/userViews');



userRoutes.get('/',userController.userPage)
userRoutes.get('/loginpage',userAuth.isLogin,userController.userLogin) 
userRoutes.post('/login',userController.verifyLogin)


userRoutes.get('/home',userAuth.isLogout,userController.userDashboard) 
userRoutes.post('/signup',userController.checkUser);
userRoutes.get('/otpPage',userController.otpPage);


userRoutes.post('/otp', userController.sucessOTP)



// userRoutes.get('/signup', userController.userSignup)
userRoutes.get('/home',userController.userPage)  
userRoutes.post('/login',userController.verifyLogin)
// userRoutes.get('/logout',userController.logout)



userRoutes.get('/productlist',userController.productspage)

module.exports = userRoutes