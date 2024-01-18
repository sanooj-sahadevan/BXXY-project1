const addressCollection = require("../controller/profileController.js");
const cartCollection = require("../models/cartModel.js");
const userCollection = require("../models/userModels.js");
const productCollection = require("../models/productModel.js");





async function grandTotal(req) {
  try {
    console.log("session" + req.session.currentUser);
    let userCartData = await cartCollection
      .find({ userId: req.session.currentUser._id })
      .populate("productId");
    console.log(Array.isArray(userCartData));
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
  try {
    let userCartData = await grandTotal(req);
    console.log(userCartData);
    res.render("userViews/cart", {
      user: req.body.user,
      currentUser: req.session.currentUser,userCartData
    });
    console.log(req.session.currentUser);
  } catch (error) {
    console.error("Error in cart:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addToCart = async (req, res) => {
  console.log(req.session.currentUser);
  try {
    let existingProduct = await cartCollection.findOne({
      userId: req.session.currentUser,
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
        productQuantity: req.body.productQuantity || 1,
        currentUser: req.session.currentUser,  user: req.body.user,
      });
    }

    console.log(req.body);
    res.redirect("back");
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).send("Internal Server Error");
  }
};












const deleteFromCart =  async (req, res) => {
  try {
    await cartCollection.findOneAndDelete({ _id: req.params.id });
    res.send("hello ur cart is deleted");
  } catch (error) {
    console.error(error);
  }
}
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
    res.json({ cartProduct, grandTotal: req.session.grandTotal,currentUser: req.session.currentUser,  user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
}
const incQty =  async (req, res) => {
  try {
    let cartProduct = await cartCollection
      .findOne({ _id: req.params.id })
      .populate("productId");
    if (cartProduct.productQuantity < cartProduct.productId.productStock) {
      cartProduct.productQuantity++;
    }
    cartProduct = await cartProduct.save();
    await grandTotal(req);
    res.json({ cartProduct, grandTotal: req.session.grandTotal ,        currentUser: req.session.currentUser,  user: req.body.user,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { cart, addToCart, grandTotal, deleteFromCart,decQty,incQty };
