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

        // if (req.session?.admin?.salesData) {
        //     let { salesData, dateValues } = req.session.admin;
        //     return res.render("userViews/orderStatus", { salesData, dateValues });
        // }
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

const productlist = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = 4;
        let skip = (page - 1) * limit;

        let count = await productCollection.find().estimatedDocumentCount();

        let productData = await productCollection.find().skip(skip).limit(limit);
        let categoryList = await categoryCollection.find(
            {},
            { categoryName: true }
        );

        res.render("adminViews/productlist.ejs", {
            productData,
            categoryList,
            count,
            limit,
            productExist: req.session.productAlreadyExists,
        });
        req.session.productAlreadyExists = null;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { salesReport };
