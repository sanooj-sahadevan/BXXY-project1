const mongoose = require("mongoose");
const userCollection = require("../models/userModels");
const bcrypt = require("bcrypt");

const existingUser = async (req, res, next) => {
  try {
    const thisUser = await userCollection.findOne({ email: req.body.email });

    if (!thisUser) {
      req.session.user = true;
      req.session.email = req.body.email;
      next();
    } else {
      req.session.emailExists = true;
      res.redirect("/loginpage");
    }
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = existingUser;
