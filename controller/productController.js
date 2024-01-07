const adminCollection = require("../models/Model");
const productCollection = require("../models/productModel.js");

const editProduct = async (req, res) => {
  try {
    let existingProduct = await productCollection.findOne({
      productName: { $regex: new RegExp(req.body.productName, "i") },
    });
    if (!existingProduct || existingProduct._id == req.params.id) {
      const updateFields = {
        $set: {
          productName: req.body.productName,
          parentCategory: req.body.parentCategory,
          productPrice: req.body.productPrice,
          productStock: req.body.productStock,
        },
      };

      // Check and conditionally add image fields to the update query
      if (req.files[0]) {
        updateFields.$set.productImage1 = req.files[0].filename;
      }

      if (req.files[1]) {
        updateFields.$set.productImage2 = req.files[1].filename;
      }

      if (req.files[2]) {
        updateFields.$set.productImage3 = req.files[2].filename;
      }

      // Perform the update
      await productCollection.findOneAndUpdate(
        { _id: req.params.id },
        updateFields
      );
      res.redirect("/admin/productManagement");
    } else {
      req.session.productAlreadyExists = existingProduct;
      res.redirect("/admin/productManagement");
    }
  } catch (error) {
    console.error(error);
  }
};

const editProductpage = async (req, res) => {
  try {
    console.log("editpage");
    const productId = req.params.id; // Fetch the product ID from URL parameter

    // Fetch or retrieve productData based on productId

    const productData = await productCollection.findById(productId); // Assuming you're using a model like Mongoose



    res.render("adminViews/editproduct.ejs", {
      productData,
      productExists: req.session.productAlreadyExists,
    });
  } catch (error) {
    console.error("Error rendering edit product page:", error);
    res.status(500).send("Internal Server Error");
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
  console.log("kk");
  try {
    let existingProduct = await productCollection.findOne({
      productName: req.body.productName,
    });
    if (!existingProduct) {
      console.log("in");
      await productCollection.insertMany([
        {
          productName: req.body.productName,
          // parentCategory: req.body.parentCategory,
          productImage1: req.files[0].filename,
          productImage2: req.files[1].filename,
          productImage3: req.files[2].filename,
          productPrice: req.body.productPrice,
          productStock: req.body.productStock,
        },
      ]);
      // console.log(req.files[0].filename);
      res.redirect("/products");
    } else {
      console.log("out");
      req.session.productAlreadyExists = existingProduct;
      res.redirect("/addproduct");
    }
  } catch (err) {
    console.log(err);
  }
};

const editAdminPage = async (req, res) => {
  res.render("adminViews/editPage");
};

const addProductPage = async (req, res) => {
  res.render("adminViews/addproduct");
};

const productlist = async (req, res) => {
  try {
    let productData = await productCollection.find();
    res.render("adminViews/productlist.ejs", {
      productData,
      productExist: req.session.productAlreadyExists,
    });
    req.session.productAlreadyExists = null;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  productlist,
  editAdminPage,
  addProductPage,
  addProduct,
  deleteProduct,
  unListProduct,
  listProduct,
  editProductpage,
  editProduct,
};
