const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")
const userAuth=require('../Authentication.js/userAuth.js')

const path = require('path');
// const cookieParser = require('cookie-parser');

// const authController = require("../controller/authController.js")



// userRoutes.use(cookieParser());
// userRoutes.use(express.static('public'))   ;

// userRoutes.set('view engine', 'ejs');
// userRoutes.set('views', './views/userViews');

userRoutes.get('/',userController.userPage)
userRoutes.get('/loginpage',userAuth.isLogout,userController.userLogin) 
userRoutes.post('/home',userAuth.isLogin,userController.userDashboard) 
userRoutes.post('/signup',userController.checkUser);
// userRoutes.get('/signup', userController.userSignup)
userRoutes.get('/home',userController.userPage)  
userRoutes.post('/login',userController.verifyLogin)
// userRoutes.get('/logout',userController.logout)



userRoutes.get('/productlist',userController.productspage)

module.exports = userRoutes