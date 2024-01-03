const express = require('express')
const adminRoutes = express()
const multer = require('multer')
const path = require('path')
const adminController = require('../controller/adminController')
const adminAuth = require('../Authentication.js/adminAuth.js')
const upload= require('../service/multer.js')






// adminRoutes.set('view engine', 'ejs');
// adminRoutes.set('views', './views/Admin');




// adminRoutes.get('/',adminAuth.isLogout,adminController.adminHome)
adminRoutes.get('/admin', adminController.adminLogin)
adminRoutes.post('/adminLogin', adminController.validateAdmin)
adminRoutes.get('/adminHome',adminController.adminHome)
adminRoutes.get('/products', adminController.productlist)
adminRoutes.get('/editProduct', adminController.editAdminPage)
adminRoutes.get('/addProduct', adminController.addProductPage)
// adminRoutes.post('/addproduct', upload.fields([{ name: 'images', maxCount: 5 }]), adminController.addProduct);
adminRoutes.post('/addproduct', upload.any(), adminController.addProduct);
adminRoutes.get('/productEdit', adminController.editProduct)



// admin_router.get('/Categories', adminController.category_list);









module.exports = adminRoutes