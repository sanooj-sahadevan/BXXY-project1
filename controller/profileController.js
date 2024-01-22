let userCollection = require("../models/userModels.js");
let addressCollection = require("../models/profileModel.js");
const orderCollection = require("../models/orderModel.js");




const profilePage = async (req, res) => {
  try {
    let orderData = await orderCollection.find({
      userId: req.session.currentUser._id,
    });
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });
    console.log(req.session.currentUser);
    console.log(addressData);

    console.log(req.session.user);
    res.render("userViews/profilePage", {
      user: req.session.user,
      orderData: req.session.currentOrder,
      orderData,currentUser: req.session.currentUser,
      addressData,
    });
  } catch (error) {
    console.log(error);
  }
};



// myAddress: async (req, res) => {
//   try {
//     const addressData = await addressCollection.find({
//       userId: req.session.currentUser._id,
//     });
//     res.render("userViews/myAddress", {
//       currentUser: req.session.currentUser,
//       addressData,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// },







const orderStatus = async (req, res) => {
  try {
    let orderData = await orderCollection.findOne({ _id: req.params.id });
    // .populate("addressChosen");
    let isCancelled = orderData.orderStatus == "Cancelled";
    
    res.render("userViews/orderStatus", {
      orderData,
      isCancelled,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderData = await orderCollection.findOne({ _id: req.params.id });

    await orderCollection.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Cancelled" } }
    );

    console.log(
      await userCollection.findByIdAndUpdate(
        { _id: req.session.currentUser._id },
        { $inc: { wallet: orderData.grandTotalCost } }
      )
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
};






const addAddress = async (req, res) => {
  try {
    console.log(req.body);
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });
      await userCollection.find(req.body)
    console.log( req.session.currentUser,);

    res.render("userViews/manageAddrress", {
      user: req.session.user,  currentUser: req.session.currentUser,addressData: req.session.addressData,addressData
    });
  } catch (error) {
    console.error(error);
  }
};



const addAddressPost = async (req, res) => {
  try {
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });
    console.log(req.session.currentUser);
    const address = {
      userId: req.session.currentUser._id,
      addressTitle: req.body.addressTitle,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      postcode:req.body.postcode,
      phone:req.body.phone
    };
     console.log('7777');
    await addressCollection.insertMany([address]);
    // res.redirect("/profile/:id");
    res.render('userViews/profilePage',{addressData, currentUser:req.session.currentUser,user:req.session.user  ,addressData: req.session.addressData       })
  } catch (error) {
    console.error(error);
  }
};

const editProfile = async (req, res) => {
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
};

const changePassword = async (req, res) => {
  try {
    res.render("userViews/changePassword", {
      user: req.session.user,
    });
    console.log(req.session.user);
  } catch (error) {
    console.error(error);
  }
};

const changePasswordPatch = async (req, res) => {
  console.log("1");
  try {
    // console.log(req.body, req.session.currentUser);
    console.log(req.session.user);

    await userCollection.updateOne(
      { _id: req.session.user },
      { $set: { password: req.body.password } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  profilePage,
  addAddress,
  addAddressPost,
  changePassword,
  editProfile,
  changePasswordPatch,
  orderStatus,
  cancelOrder,
};
