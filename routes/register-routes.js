const express = require("express");
const UserModel = require("../models/userModel.js");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const userControllers = require("../controllers/user-controller");

router.get("/", userControllers.getRegister);

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
        password: auth.hashPassword(password),
      });

      await newUser.save();

      res.sendStatus(200);
    }
  });
});

module.exports = router;
