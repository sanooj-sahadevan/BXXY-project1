const express = require('express')
const adminRoutes = express()
const multer = require('multer')
const path = require('path')
const adminController = require('../controller/adminController')
const salesReportController = require('../controller/salesReportController')
const orderController = require('../controller/orderController.js')
const productController = require('../controller/productController.js')
const categoryController = require('../controller/categoryController.js')
const upload = require('../service/multer.js')






// adminRoutes.set('view engine', 'ejs');
// adminRoutes.set('views', './views/Admin');


// --------------------------------------------------ADMIN--------------------------------------------------------------------------------

adminRoutes.get('/admin', adminController.adminLogin)
adminRoutes.post('/adminLogin', adminController.validateAdmin)
adminRoutes.get('/adminHome', adminController.adminHome)
adminRoutes.get('/dashboardData', adminController.dashboardData )
adminRoutes.get('/adminlogout', adminController.adminLogout)


// -------------------------------------------------------PRODUCT------------------------------------------------------------------------------

adminRoutes.get('/products', productController.productlist)
adminRoutes.get('/productEdit/:id', productController.editProductpage);
adminRoutes.post('/editProduct/:id', upload.any(), productController.editProduct)
adminRoutes.get('/addProduct', productController.addProductPage)
adminRoutes.post('/addproduct', upload.any(), productController.addProduct);
adminRoutes.post('/unlist/:id', productController.unListProduct)
adminRoutes.post('/list/:id', productController.listProduct)
adminRoutes.get('/deleteProduct/:id', productController.deleteProduct)


// -------------------------------------------------------CATEGORIES------------------------------------------------------------------------------


adminRoutes.get('/categories', categoryController.categoriesPage)
adminRoutes.post('/categories/list/:id', categoryController.listCategory)
adminRoutes.get('/categories/delete/:id', categoryController.deleteCategory)
adminRoutes.post('/categories/add', categoryController.addCategory)
adminRoutes.get('/categories/edit/:id', categoryController.editCategory)
adminRoutes.post('/editCategories/:id', categoryController.editCategoriesPage)
adminRoutes.get('/addCategories', categoryController.addCategoriesPage)
adminRoutes.post('/categories/unlist/:id', categoryController.unlistCategory)



// -------------------------------------------------------USER MANAGEMENT------------------------------------------------------------------------------

adminRoutes.get('/userManagement', adminController.userManagement)
adminRoutes.post('/userManagement/block/:id', adminController.blockUser)
adminRoutes.post('/userManagement/unBlock/:id', adminController.unBlockUser)



// -------------------------------------------------------ORDER MANGEMENT------------------------------------------------------------------------------


adminRoutes.get('/orderManagement', orderController.orderManagement)
adminRoutes.get('/orderManagement/pending/:id', orderController.changeStatusPending)
adminRoutes.get('/orderManagement/shipped/:id', orderController.changeStatusShipped)
adminRoutes.get('/orderManagement/delivered/:id', orderController.changeStatusDelivered)
adminRoutes.get('/orderManagement/return/:id', orderController.changeStatusReturn)
adminRoutes.get('/orderManagement/cancelled/:id', orderController.changeStatusCancelled)
adminRoutes.get('/orderManagement/cancelled/:id', orderController.changeStatusCancelled)
adminRoutes.get('/orderManagement/orderStatus/:id', orderController.orderStatusPage)




// -------------------------------------------------------SALES REPORT------------------------------------------------------------------------------


adminRoutes.get('/salesReport',  salesReportController.salesReport)
adminRoutes.post('/salesReport/filter',  salesReportController.salesReportFilter)












module.exports = adminRoutes