const orderCollection = require("../models/orderModel.js");
const formatDate = require("../service/formerDataHelper.js");
// const exceljs = require("exceljs");

const { ObjectId } = require("mongodb");

const salesReport = async (req, res) => {
    console.log("1");
    try {
        let page = Number(req.query.page) || 1;
        let limit = 4;
        let skip = (page - 1) * limit;
        let count = await orderCollection.find().estimatedDocumentCount();

        if (req.session?.admin?.salesData) {
            let { salesData, dateValues } = req.session.admin;
            return res.render("userViews/orderStatus", { salesData, dateValues });
        }
        console.log("2");
        let salesData = await orderCollection.find().skip(skip).limit(limit);
        salesData = salesData.map((v) => {
            v.orderDateFormatted = formatDate(v.orderDate);
            return v;
        });
        console.log("3");
        console.log(salesData);

        const deliveredOrders = salesData.filter(
            (order) => order.orderStatus === "Delivered"
        );
        res.render("adminViews/salesReport", {
            salesData: deliveredOrders,
            dateValues: null,
            count,
            limit,
        });
    } catch (error) {
        console.error(error);
    }
};




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
      // console.log(typeof(req.session.admin.salesData));

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
    }
  }

module.exports = { salesReport,salesReportFilter };
