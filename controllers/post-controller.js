const PostsModel = require("../models/PostsModel");
const UserModel = require("../models/userModel");

exports.getPosts = async (req, res, next) => {
  const posts = await PostsModel.find()
    .sort([["time", "desc"]])
    .lean();

  res.render("home", { posts });
};

exports.postNewPost = async (req, res, next) => {
  const username = res.locals.username;
  const content = req.body.content;

  const post = new PostsModel({ postedBy: username, content });

  await post.save();

  const postId = post._id;

  PostsModel.findOne({ _id: postId })
    .populate("postedBy")
    .exec(function (err, post) {});

  res.redirect("/home");
};
