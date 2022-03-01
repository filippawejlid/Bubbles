const express = require("express");
const UserModel = require("../models/userModel");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/user-controller");
const { getUniqueFilename } = require("../utils");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
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
      if (req.body.image) {
        const image = req.files.image;
        const filename = getUniqueFilename(image.name);
        const uploadPath = __dirname + "/public/uploads/" + filename;
        await image.mv(uploadPath);

        newUser.imageUrl = "/uploads/" + filename;
      }

      await newUser.save();
      res.sendStatus(200);
    }
  });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && auth.comparePassword(password, user.password)) {
      const userData = { userId: user._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/");
    } else {
      res.send("login failed");
    }
  });
});

router.get("/", userController.getUserPage);

router.get("/edit-post/:id", userController.getEditPost);

router.post("/edit-post/:id", userController.postEditPost);

router.post("/delete-post/:id", userController.postDeletePost);

module.exports = router;
