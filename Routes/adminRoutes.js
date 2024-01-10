const express = require('express')
const adminRoutes = express()
const multer = require('multer')
const path = require('path')
const adminController = require('../controller/adminController')
const productController = require('../controller/productController.js')
const categoryController = require('../controller/categoryController.js')
const upload= require('../service/multer.js')






// adminRoutes.set('view engine', 'ejs');
// adminRoutes.set('views', './views/Admin');


// --------------------------------------------------ADMIN--------------------------------------------------------------------------------

adminRoutes.get('/admin', adminController.adminLogin)
adminRoutes.post('/adminLogin', adminController.validateAdmin)
adminRoutes.get('/adminHome',adminController.adminHome)
adminRoutes.post('/adminlogout', adminController.adminLogout)

// -------------------------------------------------------PRODUCT------------------------------------------------------------------------------

adminRoutes.get('/products', productController.productlist)

// ----------------------EditProduct--

adminRoutes.get('/productEdit/:id', productController.editProductpage);
adminRoutes.post('/editProduct/:id', upload.any(), productController.editProduct)

// ----------------------AddProduct--
adminRoutes.get('/addProduct',productController.addProductPage)
// adminRoutes.get('/addProduct', productController.addProductPage)
adminRoutes.post('/addproduct', upload.any(), productController.addProduct);

// ----------------------List-UnlistProduct--

adminRoutes.post('/unlist/:id',productController.unListProduct)
adminRoutes.post('/list/:id',productController.listProduct)

// ----------------------DeleteProduct--

adminRoutes.get('/deleteProduct/:id',  productController.deleteProduct)


// -------------------------------------------------------CATEGORIES------------------------------------------------------------------------------


adminRoutes.get('/categories', categoryController.categoriesPage)
// adminRoutes.post('categories/unList/:id', categoryController.unlistCategory)
adminRoutes.post('/categories/list/:id', categoryController.listCategory)
adminRoutes.get('/categories/delete/:id', categoryController.deleteCategory)
adminRoutes.post('/categories/add',  categoryController.addCategory)


adminRoutes.get('/categories/edit/:id', categoryController.editCategory)
adminRoutes.post('/editCategories/:id', categoryController.editCategoriesPage)


adminRoutes.get('/addCategories', categoryController.addCategoriesPage)
adminRoutes.post('/categories/unlist/:id',categoryController.unlistCategory)



adminRoutes.get('/userManagement',adminController.userManagement)
adminRoutes.post('/userManagement/block/:id',adminController.blockUser)
adminRoutes.post('/userManagement/unBlock/:id',adminController.unBlockUser)
// adminRoutes.post('/userManagement/block/:id',  adminController.blockUser )
// adminRoutes.post('/userManagement/unBlock/:id',  adminController.unBlockUser)









module.exports = adminRoutes