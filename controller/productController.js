const adminCollection = require("../models/Model");
const productCollection = require("../models/productModel.js");
const categoryCollection = require("../models/category.js");

const editProduct = async (req, res) => {
  try {
    let existingProduct = await productCollection.findOne({
      productName: { $regex: new RegExp(req.body.productName, ) },
    });
    if (!existingProduct || existingProduct._id == req.params.id) {
      const updateFields = {
        $set: {
          productName: req.body.productName,
          parentCategory: req.body.category,
          productPrice: req.body.productPrice,
          productStock: req.body.productStock,
        },
      };

      // Check and add image to the query
      if (req.files[0]) {
        updateFields.$set.productImage1 = req.files[0].filename;
      }

      if (req.files[1]) {
        updateFields.$set.productImage2 = req.files[1].filename;
      }

      if (req.files[2]) {
        updateFields.$set.productImage3 = req.files[2].filename;
      }

      await productCollection.findOneAndUpdate(
        { _id: req.params.id },
        updateFields
      );
      res.redirect("/products");
    } else {
      req.session.productAlreadyExists = existingProduct;
      res.redirect("/products");
    }
  } catch (error) {
    console.error(error);
  }
};

const editProductpage = async (req, res) => {
  try {
    console.log("editpage");
    const productId = req.params.id;
    console.log(productId);
    const productData = await productCollection.findOne({ _id: productId });
    const categories = await categoryCollection.find({});
    console.log(categories);
    res.render("adminViews/editproduct.ejs", {
      productData,
      categories,
      // productExists: req.session.productAlreadyExists,
    });
  } catch (error) {
    console.error(error);
  }
};

const listProduct = async (req, res) => {
  try {
    await productCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isListed: true } }
    );
    res.redirect("/products");
  } catch (error) {
    console.error(error);
  }
};
const unListProduct = async (req, res) => {
  try {
    await productCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isListed: false } }
    );
    res.redirect("/products");
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async (req, res) => {
  console.log("delete");
  try {
    await productCollection.findOneAndDelete({ _id: req.params.id });
    res.redirect("/products");
  } catch (error) {
    console.error(error);
  }
};

const addProduct = async (req, res) => {
  console.log(productCollection);
  try {
    let existingProduct = await productCollection.findOne({
      productName: { $regex: new RegExp(req.body.productName, "i") },
    });
    if (!existingProduct) {
      await productCollection.insertMany([
        {
          productName: req.body.productName,
          parentCategory: req.body.parentCategory,
          productImage1: req.files[0].filename,
          productImage2: req.files[1].filename,
          productImage3: req.files[2].filename,
          productPrice: req.body.productPrice,
          productStock: req.body.productStock,
        },
      ]);
      res.redirect("/products");
    } else {
      req.session.productAlreadyExists = existingProduct;
      res.redirect("/products");
    }
  } catch (err) {
    console.log(err);
  }
};

const editAdminPage = async (req, res) => {
  res.render("adminViews/editPage");
};

const addProductPage = async (req, res) => {
  try {
    const categories = await categoryCollection.find({ isListed: true });

    console.log(categories);
    res.render("adminViews/addproduct.ejs", {
      categories,
    });
    req.session.productAlreadyExists = null;
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

const filterPriceRange = async (req, res) => {
  try {
    req.session.shopProductData = await productCollection.find({
      isListed: true,
      productPrice: {
        $gt: 0 + 500 * req.query.priceRange,
        $lte: 500 + 500 * req.query.priceRange,
      },
    });
    res.redirect("/productList");
  } catch (error) {
    console.error(error);
  }
};


const sortPriceAscending = async (req, res) => {
  try {

    req.session.shopProductData = 
      req.session?.shopProductData?.sort( (a,b)=>a.productPrice-b.productPrice  ) ||
    await productCollection
      .find({ isListed: true })
      .sort({ productPrice: 1 });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
};
const sortPriceDescending = async (req, res) => {
  try {
    
    req.session.shopProductData = 
    req.session?.shopProductData?.sort( (a,b)=>b.productPrice-a.productPrice  ) || await productCollection
      .find({ isListed: true })
      .sort({ productPrice: -1 });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  productlist,
  filterPriceRange,
  sortPriceAscending,
  sortPriceDescending,
  editAdminPage,
  addProductPage,
  addProduct,
  deleteProduct,
  unListProduct,
  listProduct,
  editProductpage,
  editProduct,
};
