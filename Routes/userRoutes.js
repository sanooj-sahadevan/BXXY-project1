const express = require("express");
const userRoutes = express.Router();
const userController = require("../controller/userController.js");
const userAuth = require("../Authentication.js/userAuth.js");
const blockedUserCheck = require("../middleware/blockUserCheck.js");
const accountController = require("../controller/profileController.js");
const cartController = require("../controller/cartController.js");
const productController = require('../controller/productController.js')
const Userauth = require("../middleware/userAuth.js");
const path = require("path");


// -------------------------------------------------------LOGIN SIGNUP------------------------------------------------------------------------------

userRoutes.get("/", userController.userPage);
userRoutes.get("/loginpage", userAuth.isLogin, userController.userLogin);
userRoutes.post("/login", userController.verifyLogin);
userRoutes.get("/logout", userAuth.isLogout, userController.userLogout);
userRoutes.post("/signup", userController.checkUser);

// -------------------------------------------------------OTP------------------------------------------------------------------------------

userRoutes.get("/otpPage", userController.otpPage);
userRoutes.post("/otp", userController.successOTP);
userRoutes.get("/resendOTP", userController.resendOtpPage);
userRoutes.get("/home", userController.userPage);

// -------------------------------------------------------PRODUCTS------------------------------------------------------------------------------

userRoutes.get("/productList", userController.productspage);
userRoutes.get("/productDetails/:id",blockedUserCheck,userController.productDetils);
userRoutes.get('/shop/filter/priceRange', blockedUserCheck, productController.filterPriceRange)
userRoutes.get('/shop/sort/priceAscending', blockedUserCheck, productController.sortPriceAscending)
userRoutes.get('/shop/sort/priceDescending', blockedUserCheck, productController.sortPriceDescending)

// -------------------------------------------------------FORGOTEN PASSWORD-------------------------------------------------------------------------

userRoutes.get("/forgotPasswordPage", userController.forgotPasswordPage);
userRoutes.post("/forgotOTP",userController.forgotUserDetailsInModel,userController.sendForgotOTP);
userRoutes.post("/forgotPasswordPage3", userController.forgotPasswordPage3);
userRoutes.post("/forgotPasswordReset", userController.forgotPasswordReset);

// -------------------------------------------------------PROFILE------------------------------------------------------------------------------

userRoutes.get("/profile/:id", blockedUserCheck, Userauth, accountController.profilePage);
userRoutes.get("/profile/orderStatus/:id",blockedUserCheck,  Userauth, accountController.orderStatus);
userRoutes.put("/profile/orderStatus/cancelOrder/:id",blockedUserCheck,Userauth,  accountController.cancelOrder);
userRoutes.get("/changePassword",blockedUserCheck,Userauth, accountController.changePassword);
userRoutes.patch("/changePassword",blockedUserCheck,Userauth, accountController.changePasswordPatch);
userRoutes.get("/editProfile", blockedUserCheck, Userauth, accountController.editProfile);
userRoutes.get("/profile/downloadInvoice/:id",blockedUserCheck,Userauth, accountController.downloadInvoice);

// -------------------------------------------------------MANAGE ADDRESS------------------------------------------------------------------------------

userRoutes.get("/manageAdrressPage",blockedUserCheck, Userauth, accountController.addAddress);
userRoutes.post("/manageAddress",blockedUserCheck,Userauth, accountController.addAddressPost);
userRoutes.get("/deleteAddress/:id",blockedUserCheck,Userauth, accountController.deleteAddress);
userRoutes.get("/editAddress/:id",blockedUserCheck,Userauth, accountController.editAddress);
userRoutes.post("/editAddress/:id",blockedUserCheck,Userauth, accountController.editAddressPost);

// ----------------------------------------------------------CART------------------------------------------------------------------------------

userRoutes.get("/cartPage", blockedUserCheck,Userauth, cartController.cart);
userRoutes.get("/cart/:id", blockedUserCheck,Userauth, cartController.addToCart);
userRoutes.delete("/cart/delete/:id",blockedUserCheck,Userauth,cartController.deleteFromCart);
userRoutes.put("/cart/decQty/:id", blockedUserCheck, Userauth, cartController.decQty);
userRoutes.put("/cart/incQty/:id", blockedUserCheck, Userauth, cartController.incQty);

// -------------------------------------------------------CHECKOUT------------------------------------------------------------------------------

userRoutes.get("/checkout", blockedUserCheck, Userauth, cartController.checkoutPage);
userRoutes.all("/orderSucess", blockedUserCheck, Userauth, cartController.orderPlaced);
userRoutes.all("/checkout/orderPlacedEnd",blockedUserCheck, Userauth, cartController.orderPlacedEnd);
userRoutes.post("/checkout/razorpay/create/orderId",blockedUserCheck, Userauth, cartController.razorpayCreateOrderId);
userRoutes.post("/checkout/applyCoupon",blockedUserCheck,Userauth, cartController.applyCoupon);


// -------------------------------------------------------filters------------------------------------------------------------------------------


userRoutes.post("/search",  userController.search);/* no work put some extra tym*/
userRoutes.get("/clearfilters",  blockedUserCheck, userController.clearFilters);
userRoutes.get('/product/filter/category/:categoryName', blockedUserCheck, userController.filterCategory)


module.exports = userRoutes;
