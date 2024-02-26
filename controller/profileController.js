let userCollection = require("../models/userModels.js");
let addressCollection = require("../models/profileModel.js");
const orderCollection = require("../models/orderModel.js");
const walletCollection = require("../models/walletModel.js");
const cartCollection = require("../models/cartModel.js");
const formatDate = require("../service/formerDataHelper.js");
const { generatevoice } = require("../service/genertePDF.js");
const productCollection = require("../models/productModel.js");

const mongoose = require('mongoose');


const profilePage = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

    const existingAddress = await addressCollection.findOne({
      userId: req.session.currentUser._id,
      _id: req.params.id,
    });
    // let page = Number(req.query.page) || 1;
    // let limit = 20;
    // let skip = (page - 1) * limit;
    let orderData = await orderCollection.find({
      userId: req.session.currentUser._id,
    });
    orderData = orderData.filter((order) => order.paymentType !== "toBeChosen");

    // .skip(skip)
    // .limit(limit);
    let addressData = await addressCollection.find({
      userId: req.session.currentUser._id,
    });

    // let count = await orderCollection.countDocuments({ isListed: true });
    // let totalPages = Math.ceil(count / limit);
    // let totalPagesArray = new Array(totalPages).fill(null);
    let walletData = await walletCollection.findOne({
      userId: req.session.currentUser._id,
    });

    //sending the formatted date to the page
    if (walletData?.walletTransaction.length > 0) {
      walletData.walletTransaction = walletData.walletTransaction
        .map((v) => {
          v.transactionDateFormatted = formatDate(v.transactionDate);
          return v;
        })
        .reverse(); //reverse is for sorting the latest transactions
    }
    console.log(req.session.currentUser);
    console.log(addressData);
    console.log(req.session.currentUser.password);
    console.log(walletData);
    console.log(req.session.user);
    res.render("userViews/profilePage", {
      user: req.session.user,
      orderData,
      currentUser: req.session.currentUser,
      addressData,
      existingAddress,
      walletData,
      cartData,
    });
  } catch (error) {
    console.log(error);
  }
};
const orderStatus = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");
console.log(cartData);
    const orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen")
      .populate("cartData.productId");

    // Ensure orderData exists before accessing its properties
    if (!orderData) {
      console.log("Order not found.");
    }

    // Logging should use `console.log`, not `res.render`
    console.log("Order Data:", orderData);
    console.log(orderData.cartData+'kooi');


    console.log("Cart Data:");
    orderData.cartData.forEach((item) => {
      console.log("Product ID:", item.productId._id);
      console.log("Product Name:", item.productId.productName);
      console.log("Product Price:", item.productId.productPrice);
    });

    const isCancelled = orderData.orderStatus === "Cancelled";
    const isReturn = orderData.orderStatus === "Return";
    const isDelivered = orderData.orderStatus === "Delivered";

    const orderStatus = {
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
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};










const cancelOrder = async (req, res) => {
  console.log("Cancelling order...");
  try {
    // Fetch cart data
    const cartData = await cartCollection.findOne({ orderId: req.params.id }).populate("productId");
    
    // Fetch order data
    const orderData = await orderCollection.findOne({ _id: req.params.id }).populate("cartData.productId");
    
    // Update product stock and stock sold
    for (const item of orderData.cartData) {
      console.log("Product ID:", item.productId._id);
      console.log("Product Name:", item.productId.productName);
      console.log("Product Price:", item.productId.productPrice);

      try {
        // Update product directly in the database
        await productCollection.updateOne(
          { _id: item.productId._id },
          {
            $inc: {
              productStock: +item.productQuantity, // Reduce quantity
              stockSold: -item.productQuantity, // Increase stock sold
            },
          }
        );
        console.log("Product updated successfully.");
      } catch (error) {
        console.error("Error updating product:", error);
        throw error; // Throw the error to handle it outside of the loop
      }
    }
    
    // Update order status to "Cancelled"
    await orderCollection.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Cancelled" } }
    );

    // Increase user's wallet balance with the refunded amount
    await userCollection.findByIdAndUpdate(
      { _id: req.session.currentUser._id },
      { $inc: { wallet: orderData.grandTotalCost } }
    );

    // Record wallet transaction for the refund
    const walletTransaction = {
      transactionDate: new Date(),
      transactionAmount: orderData.grandTotalCost,
      transactionType: "Refund from cancelled Order",
    };
    await walletCollection.findOneAndUpdate(
      { userId: req.session.currentUser._id },
      {
        $inc: { walletBalance: orderData.grandTotalCost },
        $push: { walletTransactions: walletTransaction },
      }
    );

    res.json({ success: true }); // Send success response
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, error: "An error occurred while cancelling the order." });
  }
};










const addAddress = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

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
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};

const addAddressPost = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

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
    let walletData = await walletCollection.findOne({
      userId: req.session.currentUser._id,
    });

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
      walletData,
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

    const existingAddress = await addressCollection.findOne({
      userId: req.session.currentUser,
      _id: req.params.id,
    });
    console.log(existingAddress);
    res.render("userViews/editProfile", {
      // currentUser: req.session.currentUser,
      user: req.session.user,
      existingAddress,
      cartData,
    });
  } catch (error) {
    console.error(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const cartData = await cartCollection
      .find({ userId: req.session?.currentUser?._id })
      .populate("productId");

    console.log(req.session.currentUser);

    console.log(req.session.currentUser.password);

    res.render("userViews/changePassword", {
      user: req.session.user,
      orderData: req.session.currentOrder,
      cartData,

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

const downloadInvoice = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen");
    console.log(orderData);
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=invoice.pdf",
    });
    console.log("verind");
    generatevoice(
      (chunk) => stream.write(chunk),
      () => stream.end(),
      orderData
    );
    console.log(generatevoice);
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
  downloadInvoice,
};
