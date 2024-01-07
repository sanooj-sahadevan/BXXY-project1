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
    const userDataFromUrl = await collection.findOne({ email: req.body.email });

    if (userDataFromUrl) {
      console.log("a");
      if (userDataFromUrl.block === 0) {
        console.log("b");

        if (userDataFromUrl.password === req.body.password) {
          console.log("c ");
          const user = req.session.user;
          req.session.user = userDataFromUrl._id;
          console.log(user);
          res.redirect("/");
          console.log("login Successfull");
        } else {
          console.log("third");
          res.redirect('loginpage')
          // res.render("userViews/signupLoginPage", {
          //   message: "Password Incorrect",
          // });
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
      productData,
      productExist: req.session.productAlreadyExists,
    });
  } catch (error) {
    console.error(error);
  }
};

const checkUser = async (req, res) => {
  console.log("2");
  try {
    const checking = await collection.findOne({ email: req.body.email });
    console.log(checking);
    if (checking) {
      console.log(checking);
      res.render("userViews/signupLoginPage", { notice: "Already registered" });
    } else {
      console.log("3");
      const data = new collection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
        admin: 0,
      });
      await data.save();
      console.log("saveID");

      // res.render("userViews/otp.ejs", { model: "1" });
      req.session.userEmail = req.body.email; // Store email in session
      res.redirect("/otpPage"); // Redirect to a route for sending OTP
    }
  } catch (error) {
    res.send(error.message);
  }
};

const generateOTP = () => {
  return Math.trunc(Math.random() * 10000);
};

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "peacesllr@gmail.com", // Use process.env.GMAIL_ID directly
      to: `${email}`,
      subject: "Registration OTP for BXXY",
      text: `Your OTP is ${otp}`,
    });
    return true; // Email sent successfully
  } catch (error) {
    console.error(error);
    return false; // Failed to send email
  }
};

const otpPage = async (req, res) => {
  try {
    const userEmail = req.session.userEmail; // Retrieve stored email
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);

    if (emailSent) {
      res.render("userViews/otp.ejs", { currentOTP: otp });
    } else {
      throw new Error("Error sending OTP");
    }
  } catch (error) {
    console.error(error);
    res.send("Error sending OTP");
  }
};

const sucessOTP = (req, res) => {
  res.render("userViews/signupLoginPage.ejs");
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
