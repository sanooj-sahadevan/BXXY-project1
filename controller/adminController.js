const adminCollection = require("../models/Model");
const productCollection = require("../models/productModel.js");
const userCollection = require("../models/userModels.js");






const adminLogin = async (req, res) => {
  console.log("Admin1");
  if (req.session.admin) {
    res.redirect('/')
} else {
  res.render("adminViews/login", { admin: req.session.admin });
};
}


const validateAdmin = async (req, res) => {
  const existingAdmin = await adminCollection.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (existingAdmin) {
    console.log("2");

     req.session.admin =  existingAdmin 
    res.redirect("/adminHome");
  } else {
    req.session.adminInvalidCredentials = true;
    res.redirect("/adminLogin");
  }
};


const adminHome = async (req, res) => {
  if (req.session.admin) {
    res.render("adminViews/dashboard");
  } else {
    console.log("session not work");
    res.redirect("/admin");
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
};


const userManagement = async (req, res) => {
  try {

    let userData = await userCollection.find();
   
    res.render("adminViews/userMangement", { userData });
  } catch (error) {
    console.log(error);
  }
};
const blockUser = async (req, res) => {
  try {
    await userCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { block: true } }
    );
    res.redirect("/userManagement");
   

   
  } catch (error) {
    console.log(error);
  }
}


const unBlockUser = async (req, res) => {
  try {
    await userCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { block: false } }
    );
    res.redirect("/userManagement");
  } catch (error) {
    console.error(error);
  }
};






module.exports = {
  adminHome,
  adminLogin,
  validateAdmin,
  adminLogout,
  userManagement,
  blockUser,
  unBlockUser,adminLogout
};
