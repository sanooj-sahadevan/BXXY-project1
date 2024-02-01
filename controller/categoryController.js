const categoryCollection = require("../models/category.js");
const productCollection = require("../models/productModel.js");

const editCategoriesPage = async (req, res) => {
  console.log(req.body);
  await categoryCollection.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        categoryName: req.body.categoriesName,
        categoryDescription: req.body.categoriesDescription,
      },
    }
  );
  // console.log();
  res.redirect("/categories");
};

const addCategoriesPage = async (req, res) => {
  res.render("adminViews/addCategory.ejs");
};

const categoriesPage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 8;
    let skip = (page - 1) * limit;

    let count = await categoryCollection.find().estimatedDocumentCount();

    let categoryData = await categoryCollection.find().skip(skip).limit(limit);
    res.render("adminViews/Category.ejs", {
      categoryData,
      count,
      limit,
      categoryExists: req.session.categoryExists,
    });
    req.session.categoryExists = null;
  } catch (error) {
    console.error(error);
  }
};

const addCategory = async (req, res) => {
  try {
    let existingcategory = await categoryCollection.findOne({
      categoryName: { $regex: new RegExp(req.body.categoryName, "i") },
      categoryName: req.body.categoryName,
    });console.log(existingcategory);

    if (!existingcategory) {
      await categoryCollection.insertMany([
        {
          categoryName: req.body.categoriesName,
          categoryDescription: req.body.categoriesDescription,
        },
      ]);
    }
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
  }
};

const unlistCategory = async (req, res) => {
  try {
    console.log(req.params.id);
    await categoryCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isListed: false } }
    );
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
  }
};

const listCategory = async (req, res) => {
  try {
    await categoryCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isListed: true } }
    );
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
  }
};

const editCategory = async (req, res) => {
  try {
    console.log(req.params.id);
    let data = await categoryCollection.findOne({ _id: req.params.id });

    res.render("adminViews/editCategory.ejs", { data: data });
  } catch (error) {
    console.error(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    console.log(req.body);
    await categoryCollection.findOneAndDelete({ _id: req.params.id });
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  categoriesPage,
  addCategoriesPage,
  addCategory,
  unlistCategory,
  listCategory,
  editCategory,
  deleteCategory,
  editCategoriesPage,
};
