const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, },
  addressTitle: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  phone: { type: Number, required: true },
});

const addressCollection = mongoose.model("Profile", addressSchema);

module.exports = addressCollection;