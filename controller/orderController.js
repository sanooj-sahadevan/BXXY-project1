const orderCollection = require("../models/orderModel.js");
const userCollection = require("../models/userModels.js");

// order management page
const orderManagement = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 15;
    let skip = (page - 1) * limit;

    let count = await orderCollection.find().estimatedDocumentCount();
    let orderData = await orderCollection
      .find()
      .populate("userId").skip(skip).limit(limit);
     
    console.log(orderData[0]);
    console.log(orderData);
    res.render("adminViews/orderManagement", { orderData, count, limit, page });
  } catch (error) {
    console.error(error);
  }
};

// pending
const changeStatusPending = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Pending" } }
    );
    res.redirect("/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//shipped
const changeStatusShipped = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Shipped" } }
    );
    res.redirect("/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//deliverd
const changeStatusDelivered = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Delivered" } }
    );
    res.redirect("/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//return
const changeStatusReturn = async (req, res) => {
  try {
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Return" } }
    );
    res.redirect("/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

//cancelled
const changeStatusCancelled = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("userId");
    await userCollection.findByIdAndUpdate(
      { _id: orderData.userId._id },
      { wallet: orderData.grandTotalCost }
    );
    orderData.orderStatus = "Cancelled";
    orderData.save();
    res.redirect("/orderManagement");
  } catch (error) {
    console.error(error);
  }
};

// orderStatus
const orderStatusPage = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen");
    res.render("adminViews/orderStatus", { orderData, user: req.body.user });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  orderManagement,
  orderStatusPage,
  changeStatusCancelled,
  changeStatusReturn,
  changeStatusDelivered,
  changeStatusShipped,
  changeStatusPending,
};
