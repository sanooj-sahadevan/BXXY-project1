const collection = require("../models/userModels");
const bcrypt = require("bcrypt");




const userPage = async (req, res) => {
  // const productdata=await product.find({});
  // const offerData=await Offers.find({});
  res.render("userViews/landingpage",{user:req.session.user} );
};

const userLogin = async (req, res) => {
  console.log("1");
  res.render("userViews/signupLoginPage",{
    notice: "",
    user: req.session.user
  }); 
};


const checkUser = async (req, res) => {
  console.log('2');
  try {
    const checking = await collection.findOne({ email: req.body.email });
    console.log(checking)
    if (checking) {
      console.log(checking);
      res.render("userViews/signupLoginPage", { notice: "Already registered" });
    } else {
      console.log('3');
      const data = new collection({
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
        admin: 0,
      });
      await data.save();

      res.render("userViews/signupLoginPage.ejs", { model: "1" });
    }
  } catch (error) {
    res.send(error.messsage);
  }
};

// const userSignup = (req, res) => {
//   res.render("userViews/signupLoginPage.ejs", {
//     notice: "",
//     user: req.session.user_id
//   });
// };


const verifyLogin = async (req, res) => {
  try {
    console.log("loginakkum");
    const userDataFromUrl = await collection.findOne({ email: req.body.email });

    if (userDataFromUrl) {
      console.log('a');
      if (userDataFromUrl.block === 0) {      console.log('b');

        if (userDataFromUrl.password === req.body.password) {      console.log('c ');

          req.session.user = userDataFromUrl._id;
          res.redirect("/");
          console.log("login Successfull");
        } else {console.log('third');
          res.render("userViews/signupLoginPage", { message: "Password Incorrect" });
          console.log("wrong password");
        }
      } else {console.log('second');
        res.render("userViews/signupLoginPage", { message: "Account blocked" });
        console.log("wrong password");
      }
    } else {console.log('first');
      res.render("userViews/signupLoginPage", { message: "Username Incorrect" });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

const userDashboard = async (req, res) => {
  const user = req.session.user;
  res.render("userViews/landingpage", { user: user });
};


const productspage = async (req,res) =>{
  res.render('userViews/productlist',{ user: req.session.user
  })
}



module.exports = { userPage,userLogin,checkUser,verifyLogin,userDashboard,productspage}