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



userRoutes.get('/',userController.userPage)
userRoutes.get('/loginpage',userAuth.isLogin,userController.userLogin) 
userRoutes.post('/login',userController.verifyLogin)


userRoutes.get('/home',userAuth.isLogout,userController.userDashboard) 
userRoutes.post('/signup',userController.checkUser);
userRoutes.get('/otpPage',userController.otpPage);


userRoutes.post('/otp', userController. successOTP)
userRoutes.get('/resendOTP', userController.otpPage)



userRoutes.get('/homee',userController.userPage)  
userRoutes.post('/login',userController.verifyLogin)



userRoutes.get('/productList',   userController.productspage)
userRoutes.get('/productDetails/:id',blockedUserCheck, userController.productDetils)



userRoutes.get('/forgotPasswordPage',  userController.forgotPasswordPage)
userRoutes.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)
userRoutes.post('/forgotPasswordPage3', userController.forgotPasswordPage3)
userRoutes.post('/forgotPasswordReset', userController.forgotPasswordReset)




userRoutes.get('/profile/:id', blockedUserCheck,  accountController.profilePage)
userRoutes.get('/profile/orderStatus/:id', blockedUserCheck,  accountController.orderStatus)
userRoutes.put('/profile/orderStatus/cancelOrder/:id', blockedUserCheck,  accountController.cancelOrder )



// userRoutes.get('/myAddress', blockedUserCheck,  accountController.myAddress)



userRoutes.get('/manageAdrressPage', blockedUserCheck, accountController.addAddress)
userRoutes.post('/manageAddress', blockedUserCheck, accountController.addAddressPost)
userRoutes.get('/deleteAddress/:id', blockedUserCheck, accountController.deleteAddress)
userRoutes.get('/editAddress/:id', blockedUserCheck,  accountController.editAddress)
userRoutes.post('/editAddress/:id', blockedUserCheck,  accountController.editAddressPost)





userRoutes.get('/changePassword', blockedUserCheck, accountController.changePassword)
// userRoutes.patch('/changePassword', blockedUserCheck, accountController.changePasswordPatch)

userRoutes.patch('/changePassword', blockedUserCheck,accountController.changePasswordPatch)



userRoutes.get('/editProfile', blockedUserCheck, accountController.editProfile)

userRoutes.get('/cartPage', blockedUserCheck,      cartController.cart) // i dont know

userRoutes.get('/cart/:id', blockedUserCheck,   cartController.addToCart) // i dont know



userRoutes.delete('/cart/delete/:id', blockedUserCheck, cartController.deleteFromCart) 
userRoutes.put('/cart/decQty/:id', blockedUserCheck,  cartController.decQty)
userRoutes.put('/cart/incQty/:id', blockedUserCheck,  cartController.incQty)




userRoutes.get('/checkout', blockedUserCheck, cartController.checkoutPage)
// userRoutes.all('/checkout/orderSucess', blockedUserCheck, cartController.orderSucess)

// userRoutes.all('/orderSucess',blockedUserCheck, cartController.orderSucess)



userRoutes.all('/orderSucess', blockedUserCheck, cartController.postOrderSucess)



// userRoutes.get('/account/orderList/orderStatus/:id', blockedUserCheck, accountController.orderStatus)


// userRoutes.post('/forgotOTP', userController.forgotUserDetailsInModel, userController.sendForgotOTP)


module.exports = userRoutes