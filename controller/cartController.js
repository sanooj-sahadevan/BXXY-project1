const addressCollection = require("../controller/profileController.js");
const cartCollection = require("../models/cartModel.js");
const userCollection = require("../models/userModels.js");
const productCollection = require("../models/productModel.js");
const orderCollection = require("../models/orderModel.js");
const profileCollection = require("../models/profileModel.js");
const couponCollection = require("../models/couponModel.js");
const razorpay = require("../service/razorpay.js");

async function grandTotal(req) {
  try {
    console.log("session" + req.session.currentUser);
    let userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
    console.log("uCD");
    console.log(userCartData);
    let grandTotal = 0;
    for (const v of userCartData) {
      grandTotal += v.productId.productPrice * v.productQuantity;
      await cartCollection.updateOne(
        { _id: v._id },
        {
          $set: {
            totalCostPerProduct: v.productId.productPrice * v.productQuantity,
          },
        }
      );
    }

    userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
    req.session.grandTotal = grandTotal;

    return JSON.parse(JSON.stringify(userCartData));
  } catch (error) {
    console.log(error);
  }
}

const cart = async (req, res) => {
  console.log("1");
  try {
    let addressData = await profileCollection.find({
      userId: req.session.currentUser._id,
    });

    let userCartData = await grandTotal(req);
    console.log(userCartData);
    console.log(req.session.currentUser);
    console.log(req.session.user);
    console.log("2");

    res.render("userViews/cart", {
      user: req.body.user,
      // addressData: req.session.addressData,
      addressData,
      currentUser: req.session.currentUser,
      userCartData,
      grandTotal: req.session.grandTotal,
    });
    console.log(req.session.currentUser);
  } catch (error) {
    // console.error("Error in cart:", error);
    // res.status(500).send("Internal Server Error");
    res.redirect("/loginpage");
  }
};

const addToCart = async (req, res) => {
  console.log(req.session.currentUser);
  try {
    let existingProduct = await cartCollection.findOne({
      userId: req.session.currentUser._id,
      productId: req.params.id,
    });

    if (existingProduct) {
      await cartCollection.updateOne(
        { _id: existingProduct._id },
        { $inc: { productQuantity: 1 } }
      );
    } else {
      await cartCollection.create({
        userId: req.session.currentUser._id,
        productId: req.params.id,
        productQuantity: req.body.productQuantity,
        currentUser: req.session.currentUser,
        user: req.body.user,
      });
    }

    console.log(req.body);
    res.redirect("back");
  } catch (error) {
    res.redirect("/loginpage");

    // console.error("Error in addToCart:", error);
    // res.status(500).send("Internal Server Error");
  }
};

const deleteFromCart = async (req, res) => {
  try {
    await cartCollection.findOneAndDelete({ _id: req.params.id });
    res.send("hello ur cart is deleted");
  } catch (error) {
    console.error(error);
  }
};
const decQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");
    if (cartProduct.productQuantity > 1) {
      cartProduct.productQuantity--;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({
      success: true,
      cartProduct,
      grandTotal: req.session.grandTotal,
      currentUser: req.session.currentUser,
      user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
};
const incQty = async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");
    if (cartProduct.productQuantity < cartProduct.productId.productStock) {
      cartProduct.productQuantity++;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({
      success: true,
      cartProduct,
      grandTotal: req.session.grandTotal,
      currentUser: req.session.currentUser,
      user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
};

const checkoutPage = async (req, res) => {
  try {
    let cartData = await cartCollection
      .find({ userId: req.session.currentUser._id, productId: req.params.id })
      .populate("productId");
    let addressData = await profileCollection.find({
      userId: req.session.currentUser._id,
    });
    req.session.currentOrder = await orderCollection.create({
      userId: req.session.currentUser._id,
      orderNumber: (await orderCollection.countDocuments()) + 1,
      orderDate: new Date(),
      addressChosen: JSON.parse(JSON.stringify(addressData[0])),
      cartData: await grandTotal(req),
      grandTotalCost: req.session.grandTotal,
    });
    let userCartData = await grandTotal(req);
    console.log(addressData);
    res.render("userViews/checkout", {
      user: req.body.user,
      currentUser: req.session.currentUser,
      grandTotal: req.session.grandTotal,
      userCartData,
      cartData,
      addressData: req.session.addressData,
      addressData,
    });
  } catch (error) {
    res.redirect("/manageAdrressPage");
  }
};

const orderPlaced = async (req, res) => {
  console.log("q");
  try {
    console.log(req.session.grandTotal);
    if (req.body.razorpay_payment_id) {
      //razorpay payment
      await orderCollection.updateOne(
        { _id: req.session.currentOrder._id },
        {
          $set: {
            paymentId: req.body.razorpay_payment_id,
            paymentType: "Razorpay",
          },
        }
      );
      res.redirect("/checkout/orderPlacedEnd");
    } else {
      //incase of COD
      await orderCollection.updateOne(
        { _id: req.session.currentOrder._id },
        {
          $set: {
            paymentId: "generatedAtDelivery",
            paymentType: "COD",
          },
        }
      );
      console.log("ed");
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
  }
};
const razorpayCreateOrderId = async (req, res) => {
  console.log("1");
  var options = {
    amount: req.session.grandTotal + "00", // amount in the smallest currency unit
    currency: "INR",
  };
  console.log("poind"),
    razorpay.instance.orders.create(options, function (err, order) {
      res.json(order);
      console.log(order);
    });
};

const orderPlacedEnd = async (req, res) => {
  let cartData = await cartCollection
    .find({ userId: req.session.currentUser._id })
    .populate("productId");
  console.log(cartData);

  // Reduce product stock and increase stockSold by 1 for each product in the cart
  for (const item of cartData) {
    // Update product stock
    item.productId.productStock -= item.productQuantity;

    // Increase stockSold by 1
    item.productId.stockSold += 1;

    // Save changes to the product document
    await item.productId.save();
  }

  let orderData = await orderCollection.findOne({
    _id: req.session.currentOrder._id,
  });

  if (orderData.paymentType === "toBeChosen") {
    await orderCollection.findByIdAndUpdate(orderData._id, {
      $set: { paymentType: "COD" },
    });
  }

  //delete the cart- since the order is placed
  await cartCollection.deleteMany({ userId: req.session.currentUser._id });
  console.log("deleting finished");

  console.log(cartData);

  console.log(productCollection);

  // console.log("rendering next");
  res.render("userViews/orderSucess", {
    user: req.session.user,
    orderCartData: cartData,
    orderData: req.session.currentOrder,
  });
};

const applyCoupon = async (req, res) => {
  try {
    console.log("1");
    let { couponCode } = req.body;

    //Retrive the coupon document from the database if it exists
    let couponData = await couponCollection.findOne({ couponCode });

    if (couponData) {
      /*if coupon exists:
      > check if it is applicable, i.e within minimum purchase limit & expiry date
      >proceed... */
      console.log("2");
      console.log(couponData);

      let { grandTotal } = req.session;
      let { minimumPurchase, expiryDate } = couponData;
      let minimumPurchaseCheck = minimumPurchase < grandTotal;
      let expiryDateCheck = new Date() < new Date(expiryDate);
      console.log("3");
      console.log(expiryDateCheck);
      console.log(minimumPurchaseCheck);

      if (minimumPurchaseCheck && expiryDateCheck) {
        console.log("4");

        let { discountPercentage, maximumDiscount } = couponData;
        let discountAmount =
          (grandTotal * discountPercentage) / 100 > maximumDiscount
            ? maximumDiscount
            : (grandTotal * discountPercentage) / 100;

        let { currentOrder } = req.session;
        await orderCollection.findByIdAndUpdate(
          { _id: currentOrder._id },
          {
            $set: { couponApplied: couponData._id },
            $inc: { grandTotalCost: -discountAmount },
          }
        );
        console.log("5");

        // req.session.grandTotal -= discountAmount;
        req.session.grandTotal -= discountAmount;
        console.log(req.session.grandTotal);
        console.log(discountAmount);

        // Respond with a success status and indication that the coupon was applied
        res.status(202).json({ couponApplied: true, discountAmount });
      } else {
        // Respond with an error status if the coupon is not applicable
        res.status(501).json({ couponApplied: false });
      }
    } else {
      // Respond with an error status if the coupon does not exist
      res.status(501).json({ couponApplied: false });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  cart,
  addToCart,
  grandTotal,
  deleteFromCart,
  decQty,
  incQty,
  checkoutPage,
  orderPlaced,
  razorpayCreateOrderId,
  orderPlacedEnd,
  applyCoupon,
};
