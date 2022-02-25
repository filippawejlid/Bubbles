const express = require("express");
const UserModel = require("../models/userModel.js");
const router = express.Router();
const utils = require("../utils.js");

router.get("/", (req, res) => {
  res.render("auth/register");
});

router.post("/", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  UserModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.send("username in use");
    } else if (password !== confirmPassword) {
      res.send("Incorrect password");
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: utils.hashPassword(password),
      });

      await newUser.save();

      res.sendStatus(200);
    }
  });
});

module.exports = router;
