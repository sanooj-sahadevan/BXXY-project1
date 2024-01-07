const categoryCollection = require("../models/category.js");

const productCollection = require("../models/productModel.js");




const categoriesPage = (req,res)=>{

    try {
        let categoryData = categoryCollection.find();
        res.render('adminViews/Category.ejs',{categoryData,
        categoryExists:req.session.categoryExists})
        req.session.categoryExists = null
        
    } catch (error) {
        console.error(error);
    }

}













module.exports = 
    categoriesPage
  