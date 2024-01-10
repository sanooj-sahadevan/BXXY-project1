const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const transporter = require("../service/otp.js");
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");

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
          req.session.user = true
          console.log(checking._id);
          // res.redirect("/");
          res.render('userViews/landingpage',{ user: req.session.user})
          console.log("login Successfull");
        } else {
          console.log("third");
          res.redirect("loginpage");
          res.render("userViews/signupLoginPage", {
            message: "Password Incorrect",
          });
          console.log("wrong password");
        }
      } else {
        console.log("second");
        res.render("userViews/signupLoginPage", { message: "Account blocked" });
        console.log("wrong password");
      }
    } else {
      console.log("first");
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

const productspage = async (req, res) => {
  try {
    let categoryData = await categoryCollection.find({ isListed: true });
    let productData =
      req.session?.shopProductData || (await productCollection.find());
      console.log('product');
    res.render("userViews/productlist", {
      categoryData,
      productData,
      user: req.session.user,
    });
    req.session.shopProductData = null;
  } catch (error) {
    console.error(error);
  }
};

const checkUser = async (req, res) => {
  try {
    let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);

    const checking = await collection.findOne({ email: req.body.email });

    if (checking) {
      res.render("userViews/signupLoginPage", { notice: "Already registered" });
    } else {
      const data = new collection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: encryptedPassword,
        admin: 0,
      });
      await data.save();

      // Set the userEmail in the session
      req.session.userEmail = req.body.email;

      res.redirect("/otpPage");
    }
  } catch (error) {
    console.error(error);
    res.send(error.message);
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
    const userEmail = req.session.userEmail;
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);

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

const sucessOTP = (req, res) => {
  res.render("userViews/signupLoginPage", { user: req.session.user });
};





const forgotPasswordPage =  async (req, res) => {
  try {
    res.render("userViews/forgottenPassword", {
      forgotUserEmailDoesntExist: req.session.forgotUserEmailDoesntExist, user: req.session.user 
    });
    req.session.forgotUserEmailDoesntExist = null;
  } catch (error) {
    console.error(error);
  }
}


const  forgotUserDetailsInModel= async (req, res, next) => {
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
}



const sendForgotOTP =  async (req, res) => {
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
      currentOTP: req.session.otp,user: req.session.user
    });
  } catch (error) {
    console.error(error);
  }
}

const forgotPasswordPage3 =  async (req, res) => {
  try {
    res.render("userViews/forgottenpasword3.ejs",{user:req.session.user});
  } catch (error) {
    console.error(error)
  } 
}   



const forgotPasswordReset =  async (req, res) => {
  try {
    let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    await collection.findOneAndUpdate(
      { _id: req.session.forgotUserData._id },
      { $set: { password: encryptedPassword } }
    );
    req.session.passwordResetSucess = true;
    req.session.user = true
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}



module.exports = {
  userPage,
  userLogin,
  checkUser,
  verifyLogin,
  userDashboard,
  productspage,
  otpPage,
  sucessOTP,
  forgotPasswordPage,
  forgotUserDetailsInModel,sendForgotOTP,forgotPasswordPage3,forgotPasswordReset
};
