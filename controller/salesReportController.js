const orderCollection = require("../models/orderModel.js");
const formatDate = require("../service/formerDataHelper.js");
// const exceljs = require("exceljs");
const { ObjectId } = require("mongodb");

// sales report page

const salesReport = async (req, res) => {
  try {
    if (req.session?.admin?.salesData) {
      let { salesData, dateValues } = req.session.admin;
      return res.render("adminViews/salesReport", { salesData, dateValues });
    }
    
    let page = Number(req.query.page) || 1;
    let limit = 4;
    let skip = (page - 1) * limit;

    let   count = await orderCollection.find().estimatedDocumentCount();


    let salesData = await orderCollection.find().populate("userId").skip(skip).limit(limit);
    // .skip(skip).limit(limit);

    
    console.log(salesData);
    res.render("adminViews/salesReport", { salesData,count,limit,
 dateValues: null });
  } catch (error) {
    console.error(error);
  }
};


const productlist = async (req, res) => {
  try {

    let page = Number(req.query.page) || 1;
    let limit = 4;
    let skip = (page - 1) * limit;

    let   count = await productCollection.find().estimatedDocumentCount();

    let productData = await productCollection.find().skip(skip).limit(limit);
    let categoryList = await categoryCollection.find(
      {},
      { categoryName: true }
    );

    res.render("adminViews/productlist.ejs", {
      productData,
      categoryList,count,
      limit,
      productExist: req.session.productAlreadyExists,
    });
    req.session.productAlreadyExists = null;
  } catch (error) {
    console.error(error);
  }
};













// sales report filter

const salesReportFilter = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;
    let salesDataFiltered = await orderCollection
      .find({
        orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      .populate("userId");

    salesData = salesDataFiltered.map((v) => {
      v.orderDateFormatted = formatDate(v.orderDate);
      return v;
    });

    req.session.admin = {};
    req.session.admin.dateValues = req.body;
    req.session.admin.salesData = JSON.parse(JSON.stringify(salesData));
    console.log(typeof req.session.admin.salesData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { salesReport, salesReportFilter };
