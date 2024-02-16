const collection = require("../models/userModels");
const bcrypt = require("bcrypt");
const transporter = require("../service/otp.js");
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");
const cartCollection = require("../models/cartModel.js");
const userCollection = require('../models/userModels.js');
const walletCollection =  require('../models/walletModel.js')






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
if(req.session.admin){
  res.redirect("/adminHome");
}else{
  const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

    res.render("userViews/landingpage", { user: req.session?.user,cartData });
}
}


const   userLogin = async (req, res) => {
  console.log("1");
  const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

  res.render("userViews/signupLoginPage", {
   
    user: req.session.user,cartData
  });
};





// login
const verifyLogin = async (req, res) => {
  try {
    console.log("loginakkum");

    const checking = await userCollection.findOne({ email: req.body.email });
    const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

    if (checking) {
      if (checking.block === false) {
        
        if (checking.password === req.body.password) {
          if(checking.admin===1){
            req.session.admin  = true
            res.redirect("/adminHome");
          }else{


          req.session.user = checking;
          req.session.currentUser = checking;
          res.render("userViews/landingpage", {
            user: req.session.user,
            currentUser: req.session.currentUser,cartData
          })};
          console.log("login Successfull");
          console.log(req.session.currentUser);
        } else {
          res.redirect('/loginpage')
          // res.render("userViews/signupLoginPage", {
          //   message: "Password Incorrect",
          // });
          console.log("wrong password");
        }
      } else {
        res.redirect('/loginpage')
        // res.render("userViews/signupLoginPage", { message: "Account blocked" });
        // console.log("wrong password");
      }
    } else {
      res.redirect('/loginpage')
      // res.render("userViews/signupLoginPage", {
      //   message: "Username Incorrect",
      // });
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
  try {
    const existingUser = await userCollection.findOne({ email: req.body.email });
    console.log("existing User" + existingUser);
    if (existingUser) {
      return res.render("userViews/signupLoginPage", {
        notice: "Already registered",
      });
    }else{
    const newUser = new collection({
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: req.body.password,
      admin: 0,
    });
      

    // await newUser.save();
    // req.session.user = await userModels.findOne({ email: req.body.email });

    

    console.log("req.session.user" + req.session.user);
    const otp = generateOTP();
    req.session.otp = otp
    res.redirect("/otpPage");
  }
  } catch (error) {
    console.error(error);
  }
};




//otp page
const otpPage = async (req, res) => {
  try {
    const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

    const userEmail = req.session.user.email;
    const otp = req.session.otp;
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);
    console.log(req.session.user);
    if (emailSent) {
      req.session.otp = otp;  // Store the generated OTP in the session
      res.render("userViews/otp", {
        otp,  // Pass OTP to the template
        user: req.session.user,cartData
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
    const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

    const userEmail = req.session.user.email;
    const otp = req.session.otp;

    const resendOtp = generateOTP();
    console.log("Generated OTP:", otp);

    const emailSent = await sendOTP(userEmail, otp);
    console.log(req.session.user);
    if (emailSent) {
      req.session.otp = resendOtp;  // Store the generated OTP in the session
      res.render("userViews/otp", {
        otp,  // Pass OTP to the template
        user: req.session.user,cartData
      });
    } else {
      throw new Error("Error sending OTP");
    }
  } catch (error) {
    console.error(error);
    res.send("Error sending OTP");
  }
};




// submit the otp
const successOTP = async (req, res) => {
  const successfulMessage = "Registration successful";
  const userProvidedOTP = req.body.otp;
  const generatedOTP = req.session.otp;  // Retrieve the stored OTP from the session

  console.log(userProvidedOTP);
  console.log(generatedOTP);

  if (userProvidedOTP == generatedOTP) {
    const newUser = req.session.user
    console.log(newUser);

    const userInstance = new userCollection(newUser);
    await userInstance.save();     // Save the user instance
    req.session.user = newUser
    await walletCollection.create({ userId : req.session.user._id })

    res.render("userViews/signupLoginPage", {
      user: req.session.user, currentUser:req.session.currentUser,
      // message: successfulMessage,
    });
  } else {
    res.redirect('/otpPage')
  }
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
    // let encryptedPassword = bcrypt.hashSync(req.body.newPassword, 10);
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
    console.log('comes');
    const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')
    console.log('comes2');

    const currentProduct = await productCollection.findOne({
      _id: req.params.id,
    });
    console.log('comes3');
    var cartProductQuantity=0
    if(req.session?.user?._id){
      const cartProduct = await cartCollection.findOne({ userId: req.session.user._id})
      if(cartProduct){
        var cartProductQuantity= cartProduct.productQuantity
      }
    }     
    console.log('comes4');

    let productQtyLimit= [],i=0
    while(i<(currentProduct.productStock - cartProductQuantity )){
      productQtyLimit.push(i+1)
      i++
    }
    console.log('comes5');

  res.render("userViews/productDetils",{
      user: req.session.user,
      cartData,currentProduct
    });
    console.log('comes6');

    console.log(currentProduct);
  } catch (error) { }
};



const productspage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 8;
    let skip = (page - 1) * limit;
    let productData = req.session?.shopProductData || await productCollection
      .find({ isListed: true }).skip(skip)
      .limit(limit)

      const cartData= await cartCollection.find({ userId: req.session?.currentUser?._id }).populate('productId')

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
      selectedFilter: req.session.selectedFilter,cartData
    });

    console.log(req.session.currentUser);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Internal Server Error");
  }
};



const search = async (req, res) => {
  try {
    console.log('1');
    const { q: searchQuery } = req.body; // Adjust according to the name attribute of your form input
    const searchProduct = await productCollection.find({
      $or: [
        { productName: { $regex: searchQuery, $options: "i" } },
        { parentCategory: { $regex: searchQuery, $options: "i" } },
      ],    

    }) 
     
  console.log('1');
console.log(searchProduct);
    req.session.searchProduct = searchProduct;
    res.redirect("/productList");
  } catch (error) {
    console.log(error);
  }
};


const filterCategory = async (req, res) => {
  try {
    console.log('filter');
    req.session.shopProductData = await productCollection.find({
      isListed: true,
      parentCategory: req.params.categoryName,
    });
    console.log(req.session.shopProductData);

    res.redirect("/productlist");
  } catch (error) {
    console.error(error);
  }
}



const clearFilters = async (req, res) => {
  try {
      req.session.shopProductData = null;
      res.redirect("/productlist");
  } catch (error) {
      console.error(error);
  }
}








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
  productDetils,resendOtpPage,search,filterCategory,clearFilters
};
