let userCollection = require('../models/userModels.js')
let addressCollection = require("../models/profileModel.js")



const profilePage = async (req, res) => {

    try {
        console.log(req.session.user);
        res.render("userViews/profilePage", { user: req.session.user })

    } catch (error) {
        console.log(error);
    }

}
const addAddress =  async (req, res) => {
    try {
      res.render("userViews/manageAddrress", {
         user: req.session.user 
      });
    } catch (error) {
      console.error(error);
    }
  }

const addAddressPost = async (req, res) => {
    try {
        const address = {
            userId: req.session.currentUser._id,
            addressTitle: req.body.addressTitle,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            phone: req.body.phone,
        };
        await addressCollection.insertMany([address]);
        // res.redirect("/profile/:id");
    } catch (error) {
        console.error(error);
    }
}




const changePassword = async (req, res) => {
    try {
      res.render("userViews/changePassword", {
        invalidCurrentPassword: req.session.invalidCurrentPassword,user: req.session.user 
      });
    } catch (error) {
      console.error(error);
    }
  }



  const editProfile = async(req,res)=>{
try {
    const existingAddress = await addressCollection.findOne({
        userId: req.session.currentUser,
        _id: req.params.id,
      });
      console.log(existingAddress);
      res.render("userViews/editProfile", {
        // currentUser: req.session.currentUser,
        user: req.session.user,
           existingAddress,
      });
} catch (error) {
    console.error(error);
}
  }
 



module.exports = {

    profilePage, addAddress,addAddressPost,changePassword,editProfile
};
