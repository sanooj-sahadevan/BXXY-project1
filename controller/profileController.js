let userCollection = require("../models/userModels.js");
let addressCollection = require("../models/profileModel.js");
const orderCollection = require("../models/orderModel.js");

const profilePage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 8;
    let skip = (page - 1) * limit;

    const existingAddress = await addressCollection.findOne({
      userId: req.session.currentUser._id,
      _id: req.params.id,
    });

    let orderData = await orderCollection
      .find({
        userId: req.session.currentUser._id,
      })
      .skip(skip)
      .limit(limit);
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });

    let count = await orderCollection.countDocuments({ isListed: true });
    let totalPages = Math.ceil(count / limit);
    let totalPagesArray = new Array(totalPages).fill(null);

    console.log(req.session.currentUser);
    console.log(addressData);
    console.log(req.session.currentUser.password);

    console.log(req.session.user);
    res.render("userViews/profilePage", {
      user: req.session.user,
      orderData,
      currentUser: req.session.currentUser,
      addressData,
      existingAddress,  count,
      limit,      totalPagesArray,

    });
  } catch (error) {
    console.log(error);
  }
};

const orderStatus = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen");

    let isCancelled = orderData.orderStatus === "Cancelled";
    let isReturn = orderData.orderStatus === "Return";
    let isDelivered = orderData.orderStatus === "Delivered";

    let orderStatus = {
      Cancelled: isCancelled,
      Return: isReturn,
      Delivered: isDelivered,
    };

    res.render("userViews/orderStatus", {
      orderData,
      isCancelled,
      isReturn,
      isDelivered,
      orderStatus,
      user: req.session.user,
      currentUser: req.session.currentUser,
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
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });
    console.log("address Data:");
    console.log(addressData);
    let orderData = await orderCollection.find({
      userId: req.session.currentUser._id,
    });
    console.log("req.session.currentUser:");
    console.log(req.session.currentUser);
    console.log("order Data:");
    console.log(orderData);

    res.render("userViews/manageAddrress", {
      user: req.session.user,
      currentUser: req.session.currentUser,
      addressData,
      orderData,
    });
  } catch (error) {
    console.error(error);
  }
};

const addAddressPost = async (req, res) => {
  try {
    console.log(req.session.currentUser);
    const address = {
      userId: req.session.currentUser._id,
      addressTitle: req.body.addressTitle,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      postcode: req.body.postcode,
      phone: req.body.phone,
    };
    console.log("7777");
    await addressCollection.insertMany([address]);
    // res.redirect("/profile/:id");
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });
    let orderData = await orderCollection.find({
      userId: req.session.currentUser._id,
    });
    res.render("userViews/profilePage", {
      addressData,
      currentUser: req.session.currentUser,
      user: req.session.user,
      orderData,
    });
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
  console.log("222222222222222222222222222222222");

  try {
    console.log(req.session.currentUser);

    console.log(req.session.currentUser.password);

    res.render("userViews/changePassword", {
      user: req.session.user,
      orderData: req.session.currentOrder,

      currentUser: req.session.currentUser,
    });
    console.log(req.session.user);
    console.log(req.session.currentUser);
  } catch (error) {
    console.error(error);
  }
};

const changePasswordPatch = async (req, res) => {
  try {
    // console.log(req.body, req.session.currentUser);
    console.log(req.body.password);
    console.log(req.session.user);

    await userCollection.updateOne(
      { _id: req.session.currentUser._id },
      { $set: { password: req.body.password } }
    );
    console.log("1234567");
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
};

const deleteAddress = async (req, res) => {
  try {
    await addressCollection.deleteOne({ _id: req.params.id });
    res.redirect("/profile/" + req.params.id);
  } catch (error) {
    console.log(error);
  }
};

const editAddressPost = async (req, res) => {
  try {
    const address = {
      addressTitle: req.body.addressTitle,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      phone: req.body.phone,
    };
    await addressCollection.updateOne({ _id: req.params.id }, address);

    res.redirect("/profile/" + req.params.id);
  } catch (error) {
    console.error(error);
  }
};

const editAddress = async (req, res) => {
  try {
    const existingAddress = await addressCollection.findOne({
      userId: req.session.currentUser._id,
      _id: req.params.id,
    });
    console.log(existingAddress);
    res.render("userViews/editAddress", {
      currentUser: req.session.currentUser,
      existingAddress,
      user: req.session.user,
    });
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
  deleteAddress,
  editAddressPost,
  editAddress,
};

const productspage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 8;
    let skip = (page - 1) * limit;

    let categoryData = await categoryCollection.find({ isListed: true });
    let productData = await productCollection
      .find({ isListed: true })
      .skip(skip)
      .limit(limit);

    let count = await productCollection.countDocuments({ isListed: true });

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
    });

    console.log(req.session.currentUser);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).send("Internal Server Error");
  }
};
