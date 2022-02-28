const express = require("express");
const UserModel = require("../models/userModel.js");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const PostsModel = require("../models/PostsModel.js");

exports.getRegister = (req, res, next) => {
  res.render("auth/register");
};

exports.getUserPage = async (req, res, next) => {
  const id = res.locals.id;
  const username = res.locals.username;
  const user = UserModel.findOne({ _id: id });

  const posts = await PostsModel.find()
    .sort([["time", "desc"]])
    .lean();
  const userPosts = [];

  posts.forEach((post) => {
    if (post.postedBy === username) {
      userPosts.push(post);
    }
  });

  res.render("user/user-page", { userPosts });
};

exports.getEditPost = async (req, res, next) => {
  const id = req.params.id;

  const post = await PostsModel.findOne({ _id: id });
  console.log(post);

  res.render("user/edit-post", post);
};

exports.postEditPost = (req, res, next) => {
  const id = req.params.id;

  const post = {
    content: req.body.content,
    time: Date.now(),
  };

  PostsModel.updateOne({ _id: id }, { $set: post }, (err, result) => {
    console.log(result);

    res.redirect("/");
  });
};

exports.postDeletePost = async (req, res, next) => {
  const id = req.params.id;

  PostsModel.deleteOne({ _id: id }, (err, result) => {
    res.redirect("/user");
  });
};
