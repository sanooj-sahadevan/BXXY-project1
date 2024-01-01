const express = require('express')
const adminRoutes = express()
const adminController = require('../controller/adminController')
const adminAuth = require('../Authentication.js/adminAuth.js')



// adminRoutes.set('view engine', 'ejs');
// adminRoutes.set('views', './views/Admin');



adminRoutes.get('/',adminAuth.isLogout,adminController.adminHome)
adminRoutes.get('/,adminLogin', adminController.adminLogin)
adminRoutes.post('/adminLogin', adminController.validateAdmin)




module.exports = adminRoutes