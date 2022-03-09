const UserModel = require("../models/UserModel.js");
const PostsModel = require("../models/PostsModel.js");
const CommentsModel = require("../models/CommentsModel.js");
const auth = require("../middlewares/auth.js");
const { getUniqueFilename } = require("../utils");
const jwt = require("jsonwebtoken");

exports.getSettings = async (req, res, next) => {
  const user = await UserModel.findById({ _id: res.locals.id });
  res.render("user/settings", user);
};

exports.postNewPicture = async (req, res, next) => {
  const user = await UserModel.findById({ _id: res.locals.id });

  if (req.files.image) {
    const image = req.files.image;
    const filename = getUniqueFilename(image.name);
    const uploadPath = __dirname + "/../public/uploads/" + filename;
    await image.mv(uploadPath);

    user.imageUrl = "/uploads/" + filename;

    await user.save();
  }

  res.redirect("/home/settings");
};

exports.postEditUser = async (req, res, next) => {
  const { username } = req.body;

  const takenUsername = await UserModel.findOne({ username });

  UserModel.findOne({ _id: res.locals.id }, async (err, user) => {
    if (takenUsername) {
      res.render("user/settings", {
        email: user.email,
        imageUrl: user.imageUrl,
        errorUsername: "Username is already taken",
      });
    } else {
      user.username = username;

      await user.save();
      res.redirect("/home/settings");
    }
  });
};

exports.postEditEmail = async (req, res, next) => {
  const { email } = req.body;

  const takenEmail = await UserModel.findOne({ email });

  UserModel.findOne({ _id: res.locals.id }, async (err, user) => {
    if (takenEmail) {
      res.render("user/settings", {
        email: user.email,
        imageUrl: user.imageUrl,
        errorEmail: "Email is already in use",
      });
    } else {
      user.email = email;

      await user.save();
      res.redirect("/home/settings");
    }
  });
};

exports.postDeleteUser = async (req, res, next) => {
  const id = res.locals.id;
  const posts = await PostsModel.find();
  const comments = await CommentsModel.find();

  posts.forEach((post) => {
    if (post.postedBy == id.toString()) {
      PostsModel.deleteOne({ _id: post._id }, (err, result) => {});
    }
  });

  comments.forEach((comment) => {
    if (comment.postedBy == id.toString()) {
      CommentsModel.deleteOne({ _id: comment._id }, (err, result) => {});
    }
  });

  UserModel.deleteOne({ _id: res.locals.id }, (err, result) => {
    res.cookie("token", "", { maxAge: 0 });

    res.redirect("/");
  });
};
