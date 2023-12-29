const express = require('express')
const userRoutes = express.Router()
const userController = require("../controller/userController.js")



userRoutes.get('/',userController.userHome)



module.exports = userRoutes