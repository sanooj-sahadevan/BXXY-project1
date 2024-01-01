const collection = require('../models/userModels.js')

const adminHome = (req,res)=>{
    res.render('')
}

const adminLogin = async (req,res)=>{
    res.render('dashboard.ejs')
}

const validateAdmin = async (req,res)=>{
    try{
    const user = await collection.find({admin:0})
    const admin = await collection.findOne({admin:1})
    if (req.body.name === admin.name && req.body.password === admin.password) {
        req.session.adminId = admin._id;
  
        res.render('dashboard.ejs', { user: user, orders: orderData });
      } else {
        res.render("login", { message: "Incorrect password" });
      }
    } catch (error){
        console.log(error.message);
    }
}







module.exports = {
    adminHome,adminLogin,validateAdmin
    

}