const mongoose = require("mongoose");
const fs = require("fs");

const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  email: String,
  password: String,
  imageUrl: {
    type: String,
    default: "/images/avatar.png",
  },
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
