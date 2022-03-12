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

exports.getSinglePost = async (req, res, next) => {
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
      imageUrl: post.postedBy.imageUrl,
      user: res.locals.id,
      postedByUsername: res.locals.username,
      comments,
    });
  } else {
    res.render("single-post", {
      content: post.content,
      createdAt: post.createdAt,
      imageUrl: post.postedBy.imageUrl,
      postedByUsername: post.postedBy.username,
      userId: post.postedBy._id,
      user: res.locals.id,
      comments,
    });
  }
};

exports.getEditPost = async (req, res, next) => {
  const id = req.params.id;

  const post = await PostsModel.findOne({ _id: id });

  if (post.postedBy.toString() === res.locals.id) {
    res.render("user/edit-post", post);
  } else res.sendStatus(403);
};

exports.postEditPost = async (req, res, next) => {
  const id = req.params.id;

  const originalPost = await PostsModel.findOne({ _id: id });

  const post = {
    content: req.body.content,
    time: Date.now(),
  };
  if (originalPost.postedBy.toString() === res.locals.id) {
    if (validatePost(post)) {
      PostsModel.updateOne({ _id: id }, { $set: post }, (err, result) => {
        res.redirect("/home/profile/" + originalPost.postedBy);
      });
    } else {
      res.render("user/edit-post", {
        error: "Du måste skriva något",
        content: originalPost.content,
        _id: originalPost._id,
      });
    }
  } else {
    res.sendStatus(403);
  }
};

exports.getDeletePost = async (req, res) => {
  const id = req.params.id;

  const post = await PostsModel.findOne({ _id: id });
  if (post.postedBy.toString() === res.locals.id) {
    res.render("user/delete-post", post);
  } else res.sendStatus(403);
};

exports.postDeletePost = async (req, res, next) => {
  const id = req.params.id;
  const originalPost = await PostsModel.findOne({ _id: id });

  if (originalPost.postedBy.toString() === res.locals.id) {
    PostsModel.deleteOne({ _id: id }, async (err, result) => {
      const comments = await CommentsModel.find();
      comments.forEach((comment) => {
        if (comment.originalPost == id.toString()) {
          CommentsModel.deleteOne({ _id: comment._id }, (err, result) => {});
        }
      });
      res.redirect("/home/profile/" + originalPost.postedBy);
    });
  } else res.sendStatus(403);
};

exports.getUserSingle = async (req, res, next) => {
  const id = req.params.id;

  const user = await UserModel.findById(id);

  let loggedIn = false;

  if (res.locals.id === id) {
    loggedIn = true;
  }

  const posts = await PostsModel.find().lean();

  const userPosts = [];

  for (const item of posts) {
    if (item.postedBy == id) {
      userPosts.push(item);
    }
  }

  res.render("user/user-single", {
    loggedIn,
    userName: user.username,
    imageUrl: user.imageUrl,
    userPosts,
  });
};

exports.getLogout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
};
