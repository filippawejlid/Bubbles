const express = require("express");
const UserModel = require("../models/userModel.js");
const router = express.Router();
const auth = require("../middlewares/auth.js");

exports.getRegister = (req, res, next) => {
  res.render("auth/register");
};
