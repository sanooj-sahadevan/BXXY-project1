const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const transporter = require("../service/otp.js");
const productCollection = require("../models/productModel.js");

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
        
        if (checking.block === 0) {
          
          if (checking.password === req.body.password) {
           
            req.session.user = checking._id;
            console.log(checking._id);
            res.redirect("/");
            console.log("login Successfull");
          } else {
            console.log("third");
            res.redirect('loginpage')
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
  req.session.destroy();
  res.redirect("/");
  console.log("logout");
};






const productspage = async (req, res) => {
  try {
    let productData = await productCollection.find();
    res.render("userViews/productlist", {
      productData,user: req.session.user,
      productExist: req.session.productAlreadyExists,
    });
  } catch (error) {
    console.error(error);
  }
};

const checkUser = async (req, res) => {
  try {
    const checking = await collection.findOne({ email: req.body.email });

    if (checking) {
      res.render("userViews/signupLoginPage", { notice: "Already registered" });
    } else {
      const data = new collection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
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
      res.render("userViews/otp.ejs", { currentOTP: otp, user: req.session.user });
    } else {
      throw new Error("Error sending OTP");
    }
  } catch (error) {
    console.error(error);
    res.send("Error sending OTP");
  }
};

const sucessOTP = (req, res) => {
  res.render("userViews/signupLoginPage.ejs",{user: req.session.user});
};

module.exports = {
  userPage,
  userLogin,
  checkUser,
  verifyLogin,
  userDashboard,
  productspage,
  otpPage,
  sucessOTP,
  
};
