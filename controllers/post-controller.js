const PostsModel = require("../models/PostsModel");
const UserModel = require("../models/userModel");
const CommentsModel = require("../models/CommentsModel.js");
const { validatePost } = require("../utils");

exports.getPosts = async (req, res, next) => {
  const posts = await PostsModel.find()
    .populate("postedBy")
    .sort([["time", "desc"]])
    .lean();

  console.log(posts);

  res.render("home", { posts });
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.id;
  const post = await PostsModel.findById(postId)
    .populate("postedBy")
    .populate("comments");

  const comments = await CommentsModel.find({ originalPost: postId })
    .populate("postedBy")
    .sort([["createdAt", "desc"]])
    .lean();

  console.log(post);
  res.render("single-post", {
    content: post.content,
    createdAt: post.createdAt,
    comments,
  });
};

exports.postNewPost = async (req, res, next) => {
  const userId = res.locals.id;
  const content = req.body.content;

  const post = new PostsModel({ postedBy: userId, content });

  if (validatePost(post)) {
    await post.save();

    res.redirect("/home");
  } else {
    const posts = await PostsModel.find()
      .sort([["time", "desc"]])
      .lean();

    res.render("home", {
      posts,
      content: post.content,
      error: "Du måste skriva något",
    });
  }
};
