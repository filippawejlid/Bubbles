const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();
utils = require("../utils.js");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.render("auth/login");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.password)) {
      const userData = { userId: user._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/");
    } else {
      res.send("login failed");
    }
  });
});

module.exports = router;
