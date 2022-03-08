const PostsModel = require("../models/PostsModel");
const UserModel = require("../models/UserModel");
const CommentsModel = require("../models/CommentsModel");
const { validatePost } = require("../utils");

exports.getPosts = async (req, res, next) => {
  const posts = await PostsModel.find()
    .populate("postedBy")
    .sort([["updatedAt", "desc"]])
    .lean();

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

  if (post.postedBy.username === res.locals.username) {
    res.render("single-post", {
      content: post.content,
      createdAt: post.createdAt,
      userId: post.postedBy._id,
      myPost: true,
      myPostId: post._id,
      postedByUsername: res.locals.username,
      comments,
    });
  } else {
    res.render("single-post", {
      content: post.content,
      createdAt: post.createdAt,
      postedByUsername: post.postedBy.username,
      userId: post.postedBy._id,
      comments,
    });
  }
};

exports.postNewPost = async (req, res, next) => {
  const userId = res.locals.id;
  const content = req.body.content;

  const post = new PostsModel({ postedBy: userId, content: content.trim() });

  if (validatePost(post)) {
    await post.save();

    res.redirect("/home");
  } else {
    const posts = await PostsModel.find()
      .populate("postedBy")
      .sort([["time", "desc"]])
      .lean();

    res.render("home", {
      posts,
      content: post.content,
      error: "Du måste skriva något",
    });
  }
};
