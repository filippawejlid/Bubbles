const mongoose = require("mongoose");
const fs = require("fs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  imageUrl: {
    type: String,
    default: "/images/avatar.png",
  },
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
