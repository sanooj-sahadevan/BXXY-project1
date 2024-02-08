const adminCollection = require("../models/Model");
const productCollection = require("../models/productModel.js");
const userCollection = require("../models/userModels.js");
const dashboard = require("../service/dashboardChart.js");






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
    res.redirect("/");
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.admin = false;
    res.redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};


const userManagement = async (req, res) => {
  try {

    let page = Number(req.query.page) || 1;
    let limit = 15;
    let skip = (page - 1) * limit;

    let   count = await userCollection.find().estimatedDocumentCount();


    let userData = await userCollection.find().skip(skip).limit(limit);;
   
    res.render("adminViews/userMangement", { userData,
      count,
      limit, });
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

const dashboardData =  async (req, res) => {
  try {
    const [
      productsCount,
      categoryCount,
      pendingOrdersCount,
      completedOrdersCount,
      currentDayRevenue,
      fourteenDaysRevenue,
      categoryWiseRevenue,
      shipping,
    ] = await Promise.all([
      dashboard.productsCount(),
      dashboard.categoryCount(),
      dashboard.pendingOrdersCount(),
      dashboard.completedOrdersCount(),
      dashboard.currentDayRevenue(),
      dashboard.fourteenDaysRevenue(),
      dashboard.categoryWiseRevenue(),
      dashboard.shipping(),


    ]);

    const data = {
      productsCount,
      categoryCount,
      pendingOrdersCount,
      completedOrdersCount,
      currentDayRevenue,
      fourteenDaysRevenue,
      categoryWiseRevenue,
      shipping
    };

    res.json(data);
  } catch (error) {
    console.log(error);
  }
}




module.exports = {
  adminHome,
  adminLogin,
  validateAdmin,
  adminLogout,
  userManagement,
  blockUser,
  unBlockUser,adminLogout,dashboardData
};
