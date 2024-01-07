const adminCollection = require("../models/Model");
const productCollection = require("../models/productModel.js");

const adminLogin = async (req, res) => {

  console.log("Admin1");
  req.session.admin = true;
  res.render("adminViews/login.ejs");
  }

const validateAdmin = async (req, res) => {
  console.log("1");
  const existingAdmin = await adminCollection.findOne({
    email: req.body.email,
  });

  if (
    existingAdmin &&
    existingAdmin.email === req.body.email &&
    existingAdmin.password === req.body.password
  ) {
    console.log("2");

    req.session.admin = true; 
    res.redirect("/adminHome");
  } else {
    req.session.adminInvalidCredentials = true;
    res.redirect("/adminLogin"); 
  }
};

const adminHome = async (req, res) => {
  if (req.session.admin === true) { 
    console.log("222");
    res.render("adminViews/dashboard.ejs");
  } else {
    console.log('session not work');
    res.redirect("/admin");
  }
};

const adminLogout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};


module.exports = {
  adminHome,
  adminLogin,
  validateAdmin,
  adminLogout,
};
