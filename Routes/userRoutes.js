const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")
const userAuth=require('../Authentication.js/userAuth.js')
const blockedUserCheck = require('../middleware/blockUserCheck.js')
const accountController =  require("../controller/profileController.js")
const cartController =  require("../controller/cartController.js")
const auth = require('../middleware/adminAuth.js')
const path = require('path');



// userRoutes.set('view engine', 'ejs');
// userRoutes.set('views', './views/userViews');



// -------------------------------------------------------LOGIN SIGNUP------------------------------------------------------------------------------



userRoutes.get('/',userController.userPage)
userRoutes.get('/loginpage',userAuth.isLogin,userController.userLogin) 
userRoutes.post('/login',userController.verifyLogin)
userRoutes.get('/logout',userAuth.isLogout,userController.userLogout) 
userRoutes.post('/signup',userController.checkUser);


// -------------------------------------------------------OTP------------------------------------------------------------------------------


userRoutes.get('/otpPage',userController.otpPage);
userRoutes.post('/otp', userController. successOTP)
userRoutes.get('/resendOTP', userController.resendOtpPage)      
userRoutes.get('/home',userController.userPage)  



// -------------------------------------------------------PRODUCTS------------------------------------------------------------------------------


userRoutes.get('/productList',   userController.productspage)
userRoutes.get('/productDetails/:id',blockedUserCheck, userController.productDetils)



// -------------------------------------------------------FORGOTEN PASSWORD-------------------------------------------------------------------------


userRoutes.get('/forgotPasswordPage',  userController.forgotPasswordPage)
userRoutes.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)
userRoutes.post('/forgotPasswordPage3', userController.forgotPasswordPage3)
userRoutes.post('/forgotPasswordReset', userController.forgotPasswordReset)



// -------------------------------------------------------PROFILE------------------------------------------------------------------------------



userRoutes.get('/profile/:id', blockedUserCheck,  accountController.profilePage)
userRoutes.get('/profile/orderStatus/:id', blockedUserCheck,  accountController.orderStatus)
userRoutes.put('/profile/orderStatus/cancelOrder/:id', blockedUserCheck,  accountController.cancelOrder )
userRoutes.get('/changePassword', blockedUserCheck, accountController.changePassword)
userRoutes.patch('/changePassword', blockedUserCheck,accountController.changePasswordPatch)
userRoutes.get('/editProfile', blockedUserCheck, accountController.editProfile)



// -------------------------------------------------------MANAGE ADDRESS------------------------------------------------------------------------------



userRoutes.get('/manageAdrressPage', blockedUserCheck, accountController.addAddress)
userRoutes.post('/manageAddress', blockedUserCheck, accountController.addAddressPost)
userRoutes.get('/deleteAddress/:id', blockedUserCheck, accountController.deleteAddress)
userRoutes.get('/editAddress/:id', blockedUserCheck,  accountController.editAddress)
userRoutes.post('/editAddress/:id', blockedUserCheck,  accountController.editAddressPost)



// -------------------------------------------------------CART------------------------------------------------------------------------------




userRoutes.get('/cartPage', blockedUserCheck,      cartController.cart) 
userRoutes.get('/cart/:id', blockedUserCheck,   cartController.addToCart) 
userRoutes.delete('/cart/delete/:id', blockedUserCheck, cartController.deleteFromCart) 
userRoutes.put('/cart/decQty/:id', blockedUserCheck,  cartController.decQty)
userRoutes.put('/cart/incQty/:id', blockedUserCheck,  cartController.incQty)



// -------------------------------------------------------CHECKOUT------------------------------------------------------------------------------



userRoutes.get('/checkout', blockedUserCheck, cartController.checkoutPage)
userRoutes.all('/orderSucess', blockedUserCheck, cartController.orderPlaced)
userRoutes.all('/checkout/orderPlacedEnd', blockedUserCheck,  cartController.orderPlacedEnd)
userRoutes.post('/checkout/razorpay/create/orderId', blockedUserCheck, cartController.razorpayCreateOrderId)
userRoutes.post('/checkout/applyCoupon', blockedUserCheck, cartController.applyCoupon)










module.exports = userRoutes