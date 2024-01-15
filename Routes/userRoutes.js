const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")
const userAuth=require('../Authentication.js/userAuth.js')
const blockedUserCheck = require('../middleware/blockUserCheck.js')
const accountController =  require("../controller/profileController.js")



const path = require('path');



// userRoutes.set('view engine', 'ejs');
// userRoutes.set('views', './views/userViews');



userRoutes.get('/',userController.userPage)
userRoutes.get('/loginpage',userAuth.isLogin,userController.userLogin) 
userRoutes.post('/login',userController.verifyLogin)


userRoutes.get('/home',userAuth.isLogout,userController.userDashboard) 
userRoutes.post('/signup',userController.checkUser);
userRoutes.get('/otpPage',userController.otpPage);


userRoutes.post('/otp', userController. successOTP)
userRoutes.get('/resendOTP', userController.otpPage)



userRoutes.get('/home',userController.userPage)  
userRoutes.post('/login',userController.verifyLogin)



userRoutes.get('/productList',   userController.productspage)
userRoutes.get('/productDetails/:id',blockedUserCheck, userController.productDetils)


userRoutes.get('/forgotPasswordPage',  userController.forgotPasswordPage)
userRoutes.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)
userRoutes.post('/forgotPasswordPage3', userController.forgotPasswordPage3)
userRoutes.post('/forgotPasswordReset', userController.forgotPasswordReset)




userRoutes.get('/profile/:id', blockedUserCheck,  accountController.profilePage)
userRoutes.get('/manageAdrressPage', blockedUserCheck, accountController.addAddress)
userRoutes.post('/manageAdrress', blockedUserCheck, accountController.addAddressPost)
userRoutes.post('/manageAdrress', blockedUserCheck, accountController.addAddressPost)


userRoutes.get('/changePassword', blockedUserCheck, accountController.changePassword)
// userRoutes.patch('/changePassword', blockedUserCheck, accountController.changePasswordPatch)

userRoutes.patch('/changePassword', blockedUserCheck,accountController.changePasswordPatch)



userRoutes.get('/editProfile', blockedUserCheck, accountController.editProfile)








// userRoutes.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)


module.exports = userRoutes