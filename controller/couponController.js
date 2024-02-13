const couponCollection = require("../models/couponModel.js");
const formatDate = require('../service/formerDataHelper.js')
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");

const couponManagement = async (req, res) => {
  try {




    let couponData = await couponCollection.find();
    couponData = couponData.map((v) => {
      v.startDateFormatted = formatDate(v.startDate, "YYYY-MM-DD");
      v.expiryDateFormatted = formatDate(v.expiryDate, "YYYY-MM-DD");
      return v;
    });
    res.render("adminViews/coupon", { couponData,
    
 });
  } catch (error) {
    console.error(error);
  }
};

const addCoupon = async (req, res) => {
  try {
    let existingCoupon = await couponCollection.findOne({
      couponCode: { $regex: new RegExp(req.body.couponCode, "i") },
    });

    if (!existingCoupon) {
      await couponCollection.insertMany([
        {
          couponCode: req.body.couponCode,
          discountPercentage: req.body.discountPercentage,
          startDate: new Date(req.body.startDate),
          expiryDate: new Date(req.body.expiryDate),
          minimumPurchase: req.body.minimumPurchase,
          maximumDiscount: req.body.maximumDiscount,
        },
      ]);
      res.json({ couponAdded: true });
    } else {
      res.json({ couponCodeExists: true });
    }
  } catch (error) {
    console.error(error);
  }
};

const editCoupon = async (req, res) => {
  try {
    console.log('edit coupon');
    let existingCoupon = await couponCollection.findOne({
      couponCode: { $regex: new RegExp(req.body.couponCode, "i") },
    });
    if (!existingCoupon || existingCoupon._id == req.params.id) {
      let updateFields = {
        couponCode: req.body.couponCode,
        discountPercentage: req.body.discountPercentage,
        startDate: new Date(req.body.startDate),
        expiryDate: new Date(req.body.expiryDate),
        minimumPurchase: req.body.minimumPurchase,
        maximumDiscount: req.body.maximumDiscount,
      };
      await couponCollection.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateFields }
      );
      res.json({ couponEdited: true });
    } else {
      res.json({ couponCodeExists: true });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  couponManagement,
  addCoupon,
  editCoupon,
};
