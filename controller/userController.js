const userCollection = require("../models/userModels");


const userHome = (req, res) => {
  res.render('userViews/landingpage.ejs')
}

const signupLoginPage = (req,res)=>{
    res.render('userViews/signupLoginPage')    
}

const signup = async (req,res)=>{
    // let encryptedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = new userCollection({
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: encryptedPassword,
    });

    await newUser.save();
    req.session.user = true;
    res.redirect("/home");
  };
// const checkUser = async (req, res) => {
//   try {
//     const checking = await collection.findOne({ email: req.body.email });
//     console.log(checking)
//     if (checking) {
//       console.log(checking);
//       res.render("userViews/signupLoginPage", { notice: "Already registered" });
//     } else {
//       const data = new collection({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: req.body.password,
//         admin: 0,
//       });
//       await data.save();
// res.redirect
//       res.render('userViews/signupLoginPage', { model: "1" });
//     }
//   } catch (error) {
//     res.send(error.messsage);
//   }
// };

// const userSignup = (req, res) => {
//   res.render("userViews/signupLoginPage", {
//     notice: "",
//     user: req.session.user_id
//   });
// };


module.exports = { userHome,signup,signupLoginPage}