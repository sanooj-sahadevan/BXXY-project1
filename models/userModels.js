const mongoose = require("mongoose");

const LogInSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
        required: true
    },admin: {
      type: Number,
      default: 0,
    
    // },
    },block: {
      type: Boolean,
      default: false,
    },
  }
  // {
  //   versionKey: false,
  // }
);

module.exports = mongoose.model("user", LogInSchema);
