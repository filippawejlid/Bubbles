const UserModel = require("../models/UserModel.js");
const auth = require("../middlewares/auth.js");
const { getUniqueFilename } = require("../utils");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.getRegister = (req, res, next) => {
  res.render("auth/register", { anon: "/images/avatar.png" });
};

exports.postRegister = (req, res, next) => {
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

      if (req.files && req.files.image) {
        const image = req.files.image;
        const filename = getUniqueFilename(image.name);
        const uploadPath = __dirname + "/../public/uploads/" + filename;
        await image.mv(uploadPath);
        newUser.imageUrl = "/uploads/" + filename;
      }

      await newUser.save();
      const userData = { userId: newUser._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/");
    }
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
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
};

exports.googleAuthRoute = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleSuccessCallback = async (req, res) => {
  UserModel.findOne({ googleId: req.user.id }, async (err, user) => {
    const userData = {};

    if (user) {
      userData.userId = user._id;
      userData.username = user.username;
    } else {
      const newUser = new UserModel({
        googleId: req.user.id,
        username: req.user.displayName,
        email: req.user.emails[0].value,
        imageUrl: req.user.photos[0].value,
      });
      const result = await newUser.save();
      userData.userId = result._id;
      userData.username = result.username;
    }

    const accessToken = jwt.sign(userData, process.env.JWTSECRET);

    res.cookie("token", accessToken);
    res.redirect("/");
  });
};
