const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const transporter = require("../service/otp.js");
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");
const cartCollection = require("../models/cartModel.js");
const userCollection = require("../models/userModels.js");
const walletCollection = require("../models/walletModel.js");

// generate OTP

const generateOTP = () => {
  return Math.trunc(Math.random() * 10000);
};

// send OTP
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

// first landing page
const userPage = async (req, res) => {
  console.log();
  if (req.session.admin) {
    res.redirect("/adminHome");
  } else {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

    res.render("userViews/landingpage", { user: req.session?.user, cartData });
  }
};

const userLogin = async (req, res) => {
  console.log("1");
  const cartData = await cartCollection
    .find({ userId: req.session?.currentUser?._id })
    .populate("productId");
  var message = req.query.message;

  res.render("userViews/signupLoginPage", {
    user: req.session.user,
    cartData,
    message: message,
  });
};

// login
const verifyLogin = async (req, res) => {
  try {
    console.log("loginakkum");

    const checking = await userCollection.findOne({ email: req.body.email });
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

    if (checking) {
      if (checking.block === false) {
        if (checking.password === req.body.password) {
          if (checking.admin === 1) {
            req.session.admin = true;
            res.redirect("/adminHome");
          } else {
            req.session.user = checking;
            req.session.currentUser = checking;
            res.render("userViews/landingpage", {
              user: req.session.user,
              currentUser: req.session.currentUser,
              cartData,
              message: null, // No message to display
            });
          }
          console.log("login Successful");
          console.log(req.session.currentUser);
        } else {
          res.redirect("/loginpage?message=Password%20Incorrect");
          console.log("wrong password");
        }
      } else {
        res.redirect("/loginpage?message=Account%20Blocked");
        console.log("Account Blocked");
      }
    } else {
      res.redirect("/loginpage?message=Username%20Incorrect");
      console.log("Username Incorrect");
    }
  } catch (error) {
    console.log(error);
  }
};

//logout
const userLogout = async (req, res) => {
  res.redirect("/");
};

//signup
const checkUser = async (req, res) => {
  console.log("2");
  try {
    const checking = await userCollection.findOne({ email: req.body.email });
    console.log(checking);

    if (checking) {
      console.log(checking);
      return res.render("userViews/signupLoginPage", {
        notice: "Already registered",
      }); // Return the response to prevent further execution
    } else {
      console.log("3");
      const data = new collection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
        admin: 0,
      });
      // await data.save(); // Save the data

      req.session.userEmail = req.body.email;
      req.session.data = data;
      return res.redirect("/otpPage"); // Redirect to OTP page
    }
  } catch (error) {
    console.error(error);
    return res.redirect("/loginpage"); // Redirect to login page on error
  }
};

const otpPage = async (req, res) => {
  try {
    let cartData;

    if (req.session.data) {
      cartData = await cartCollection
        .find({ userId: req.session.data._id })
        .populate("productId");
    } else {
      cartData = [];
    }

    console.log("1");
    const userEmail = req.session.userEmail;
    console.log("1");

    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    const emailSent = await sendOTP(userEmail, otp);
    console.log(req.session.user);

    if (emailSent) {
      req.session.otp = otp;

      res.render("userViews/otp", {
        otp,
        data: req.session.data,
        cartData,
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

const resendOtpPage = async (req, res) => {
  try {
    let cartData;

    if (req.session.data) {
      cartData = await cartCollection
        .find({ userId: req.session.data._id })
        .populate("productId");
    } else {
      cartData = [];
    }

    const userEmail = req.session.userEmail;
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);
    console.log(req.session.data);
    if (emailSent) {
      req.session.otp = otp;
      res.render("userViews/otp", {
        otp,
        data: req.session.data,
        cartData,
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

const successOTP = async (req, res) => {
  try {
    let cartData;
    console.log("1");
    if (req.session.user) {
      cartData = await cartCollection
        .find({ userId: req.session.user._id })
        .populate("productId");
    } else {
      cartData = [];
    }
    console.log("2");

    const userProvidedOTP = req.body.otp;
    const generatedOTP = req.session.otp;
    console.log("3");

    console.log("User Provided OTP:", userProvidedOTP);
    console.log("Generated OTP:", generatedOTP);
    console.log("4");

    if (userProvidedOTP == generatedOTP) {
      const newUser = req.session.data;
      console.log("New User:", newUser);

      // Save the new user data to the database
      await userCollection.create(newUser);

      // Create a new wallet entry for the user
      await walletCollection.create({ userId: newUser._id });
      var message = req.query.message;

      res.render("userViews/signupLoginPage", {
        user: newUser,
        currentUser: req.session.currentUser,
        cartData,
        user: req.session.user,
        data: req.session.data,
        message: message,
      });
    } else {
      // Redirect to the OTP page if OTP verification fails
      res.redirect("/otpPage");
    }
  } catch (error) {
    console.error(error);
    res.send("Error processing OTP");
  }
};

const forgotPasswordPage = async (req, res) => {
  try {
    let cartData;

    if (req.session.user) {
      cartData = await cartCollection
        .find({ userId: req.session?.currentUser?._id })
        .populate("productId");
    } else {
      cartData = [];
    }
    var message = req.query.message;
    res.render("userViews/forgottenPassword", {
      forgotUserEmailDoesntExist: req.session.forgotUserEmailDoesntExist,
      user: req.session.user,
      cartData,
      message: message,
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
    if (req.session.user) {
      cartData = await cartCollection
        .find({ userId: req.session?.currentUser?._id })
        .populate("productId");
    } else {
      cartData = [];
    }
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
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};

const forgotPasswordPage3 = async (req, res) => {
  try {
    if (req.session.user) {
      cartData = await cartCollection
        .find({ userId: req.session?.currentUser?._id })
        .populate("productId");
    } else {
      cartData = [];
    }
    res.render("userViews/forgottenpasword3", {
      user: req.session.user,
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};

const forgotPasswordReset = async (req, res) => {
  try {
    await collection.findOneAndUpdate(
      { _id: req.session.forgotUserData._id },
      { $set: { password: req.body.password } }
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
    console.log("comes");
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");
    console.log("comes2");

    const currentProduct = await productCollection.findOne({
      _id: req.params.id,
    });
    console.log("comes3");
    var cartProductQuantity = 0;
    if (req.session?.user?._id) {
      const cartProduct = await cartCollection.findOne({
        userId: req.session.user._id,
      });
      if (cartProduct) {
        var cartProductQuantity = cartProduct.productQuantity;
      }
    }
    console.log("comes4");

    let productQtyLimit = [],
      i = 0;
    while (i < currentProduct.productStock - cartProductQuantity) {
      productQtyLimit.push(i + 1);
      i++;
    }
    console.log("comes5");

    res.render("userViews/productDetils", {
      user: req.session.user,
      cartData,
      currentProduct,
    });
    console.log("comes6");

    console.log(currentProduct);
  } catch (error) {}
};

const productspage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 8;
    let skip = (page - 1) * limit;
    let productData =
      req.session?.shopProductData?.slice(skip, limit*page )
       ||
      (await productCollection
        .find({ isListed: true })
        .skip(skip)
        .limit(limit));

    if (req.session.user) {
      cartData = await cartCollection
        .find({ userId: req.session?.currentUser?._id })
        .populate("productId");
    } else {
      cartData = [];
    }
    let categoryData = await categoryCollection.find({ isListed: true });
    // let productData = await productCollection
    //   .find({ isListed: true })
    //   .skip(skip)
    //   .limit(limit)

    let count;
    if (req.session && req.session.shopProductData) {
      count = req.session.shopProductData.length;
    } else {
      count = await productCollection.countDocuments({ isListed: true });
    }

    let totalPages = Math.ceil(count / limit);
    let totalPagesArray = new Array(totalPages).fill(null);
    res.render("userViews/productlist", {
      categoryData,
      productData,
      currentUser: req.session.currentUser,
      user: req.session.user,
      count,
      limit,
      totalPagesArray,
      currentPage: page,
      selectedFilter: req.session.selectedFilter,
      selectedFilter: req.session.selectedFilter,
      cartData,
    });

    console.log(req.session.currentUser);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const search = async (req, res) => {
  try {
    const { search } = req.body;
    console.log("search : ", search);
    const products = await productCollection
      .find({
        $or: [{ productName: { $regex: search, $options: "i" } }],
      })
      .populate("parentCategory");
    console.log(products);
    req.session.shopProductData = products;
    res.redirect("/productList");
  } catch (error) {
    console.log(error);
  }
};

const filterCategory = async (req, res) => {
  try {
    console.log("filter");
    req.session.shopProductData = await productCollection.find({
      isListed: true,
      parentCategory: req.params.categoryName,
    });
    console.log(req.session.shopProductData);

    res.redirect("/productlist");
  } catch (error) {
    console.error(error);
  }
};

const clearFilters = async (req, res) => {
  try {
    req.session.shopProductData = null;
    res.redirect("/productlist");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  userPage,
  userLogin,
  checkUser,
  verifyLogin,
  userLogout,
  productspage,
  otpPage,
  successOTP,
  forgotPasswordPage,
  forgotUserDetailsInModel,
  sendForgotOTP,
  forgotPasswordPage3,
  forgotPasswordReset,
  productDetils,
  resendOtpPage,
  search,
  filterCategory,
  clearFilters,
};
