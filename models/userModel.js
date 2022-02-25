const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      content: { type: String, required: true },
      time: { type: Number, default: Date.now },
    },
  ],
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
