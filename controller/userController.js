const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const transporter = require("../service/otp.js");
const userCollection = require("../models/userModels.js");
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");
const userModels = require("../models/userModels");
const cartCollection = require("../controller/cartController.js")

const userPage = async (req, res) => {
  res.render("userViews/landingpage", { user: req.session.user });
};

const userLogin = async (req, res) => {
  console.log("1");
  res.render("userViews/signupLoginPage", {
    notice: "",
    user: req.session.user,
  });
};

// const Logout = async (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
//   console.log("logout");
// };

const verifyLogin = async (req, res) => {
  try {
    console.log("loginakkum");

    const checking = await collection.findOne({ email: req.body.email });

    if (checking) {
      if (checking.block === false) {
        if (checking.password === req.body.password) {
          req.session.user = checking;
          // console.log(checking);
          req.session.currentUser = checking;
          res.render("userViews/landingpage", {
            user: req.session.user,
            currentUser: req.session.currentUser,
          });
          console.log("login Successfull");
          console.log(req.session.currentUser);
        } else {
          res.render("userViews/signupLoginPage", {
            message: "Password Incorrect",
          });
          console.log("wrong password");
        }
      } else {
        res.render("userViews/signupLoginPage", { message: "Account blocked" });
        console.log("wrong password");
      }
    } else {
      res.render("userViews/signupLoginPage", {
        message: "Username Incorrect",
      });
    }
  } catch (error) {
    res.render("error", { error: error.message });
  }
};

const userDashboard = async (req, res) => {
  res.clearCookie("userToken");

  req.session.destroy();
  res.redirect("/");
  console.log("logout");
};

const checkUser = async (req, res) => {
  try {
    const existingUser = await collection.findOne({ email: req.body.email });
    console.log("existing User" + existingUser);
    if (existingUser) {
      return res.render("userViews/signupLoginPage", {
        notice: "Already registered",
      });
    }

    // Hash the password only when creating a new user
    // let encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new collection({
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: req.body.password,
      admin: 0,
    });

    await newUser.save();
    req.session.user = await userModels.findOne({ email: req.body.email });
    console.log("req.session.user" + req.session.user);
    res.redirect("/otpPage");
  } catch (error) {
    console.error(error);
  }
};

const generateOTP = () => {
  return Math.trunc(Math.random() * 10000);
};

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "peacesllr@gmail.com",
      to: `${email}`,
      subject: "Registration OTP for BXXY",
      text: `Your OTP is ${otp}`,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const otpPage = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);
    console.log(req.session.user);
    if (emailSent) {
      res.render("userViews/otp", {
        currentOTP: otp,
        user: req.session.user,
      });
    } else {
      throw new Error("Error sending OTP");
    }
  } catch (error) {
    console.error(error);
    res.send("Error sending OTP");
  }
};

const successOTP = (req, res) => {
  const successfulMessage = "Registration successful";
  res.render("userViews/signupLoginPage", {
    user: req.session.user,
    message: successfulMessage,
  });
};

const forgotPasswordPage = async (req, res) => {
  try {
    res.render("userViews/forgottenPassword", {
      forgotUserEmailDoesntExist: req.session.forgotUserEmailDoesntExist,
      user: req.session.user,
    });
    req.session.forgotUserEmailDoesntExist = null;
  } catch (error) {
    console.error(error);
  }
};

const forgotUserDetailsInModel = async (req, res, next) => {
  try {
    console.log(req.body);
    const forgotUserData = await collection.findOne({
      email: req.body.email,
    });
    if (!forgotUserData) {
      req.session.forgotUserEmailDoesntExist = true;
      return res.redirect("/forgotPasswordPage");
    }
    req.session.forgotUserData = forgotUserData;
    next();
  } catch (error) {
    console.error(error);
  }
};

const sendForgotOTP = async (req, res) => {
  try {
    const otp = Math.trunc(Math.random() * 10000);
    req.session.otp = otp;
    req.session.otpTime = new Date();
    console.log(otp);
    await transporter.sendMail({
      from: "peacesllr@gmail.com",
      to: `${req.body.email}`,
      subject: "Registration OTP for BXXY",
      text: `Your OTP is ${otp}`,
    });
    res.render("userViews/forgottenPassword2", {
      currentOTP: req.session.otp,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
  }
};

const forgotPasswordPage3 = async (req, res) => {
  try {
    res.render("userViews/forgottenpasword3.ejs", { user: req.session.user });
  } catch (error) {
    console.error(error);
  }
};

const forgotPasswordReset = async (req, res) => {
  try {
    let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    await collection.findOneAndUpdate(
      { _id: req.session.forgotUserData._id },
      { $set: { password: encryptedPassword } }
    );
    req.session.passwordResetSucess = true;
    req.session.user = true;
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};





const productDetils = async (req, res) => {
  try {
    const currentProduct = await productCollection.findOne({
      _id: req.params.id,
    });
    res.render("userViews/productDetils.ejs", {
      user: req.session.user,
      currentProduct,
    });
    console.log(currentProduct);
  } catch (error) {}
};
const productspage = async (req, res) => {
  try {
    let categoryData = await categoryCollection.find({ isListed: true });
    let productData = await productCollection.find({ isListed: true });

    res.render("userViews/productlist", {
      categoryData,
      productData,
      currentUser: req.session.currentUser,
      user: req.session.user,
      // userDetails: { checking }, // Including checking in userDetails object
    });
    console.log(req.session.currentUser);
    // console.log(userData);
    // req.session.shopProductData = null;
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Internal Server Error");
  }
};




const orderSucess =  async (req, res) => {
  let cartData = await cartCollection.find({ userId: req.session.currentUser._id })
   

  res.render("userViews/orderSucess", {
    orderCartData: cartData,
    orderData: req.session.currentOrder,
  });

  await cartCollection.deleteMany({ userId: req.session.currentUser._id });
  console.log("deleted");
}








module.exports = {
  userPage,
  userLogin,
  checkUser,
  verifyLogin,
  userDashboard,
  productspage,
  otpPage,
  successOTP,
  forgotPasswordPage,
  forgotUserDetailsInModel,
  sendForgotOTP,
  forgotPasswordPage3,
  forgotPasswordReset,
  productDetils
};
