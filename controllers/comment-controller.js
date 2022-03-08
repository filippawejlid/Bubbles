const CommentsModel = require("../models/CommentsModel.js");
const PostsModel = require("../models/PostsModel.js");

const { validateComment } = require("../utils.js");

exports.postNewComment = async (req, res, next) => {
  const userId = res.locals.id;
  const text = req.body.text;
  const postId = req.params.id;

  const comment = new CommentsModel({
    postedBy: userId,
    text,
    originalPost: postId,
  });

  if (validateComment(comment)) {
    await comment.save();
    res.redirect("/home/posts/" + postId);
  } else {
    const post = await PostsModel.findById(req.params.id)
      .populate("postedBy")
      .populate("comments");

    const comments = await CommentsModel.find({ originalPost: postId })
      .populate("postedBy")
      .sort([["createdAt", "desc"]])
      .lean();

    res.render("single-post", {
      content: post.content,
      createdAt: post.createdAt,
      comments,
      error: "Du måste skriva något",
    });
  }
};

exports.getEditComment = async (req, res, next) => {
  const id = req.params.id;

  const comment = await CommentsModel.findOne({ _id: id });

  res.render("user/edit-comment", comment);
};

exports.postEditComment = async (req, res, next) => {
  const id = req.params.id;

  const comment = await CommentsModel.findOne({ _id: id });

  const updatedComment = {
    text: req.body.text,
  };

  if (validateComment(updatedComment)) {
    CommentsModel.updateOne(
      { _id: id },
      { $set: updatedComment },
      (err, result) => {
        res.redirect("/home/posts/" + comment.originalPost);
      }
    );
  } else {
    res.render("user/edit-comment", {
      error: "No input detected",
      text: comment.text,
    });
  }
};

exports.getDeleteComment = async (req, res, next) => {
  const id = req.params.id;

  const comment = await CommentsModel.findOne({ _id: id });

  res.render("user/delete-comment", comment);
};

exports.postDeleteComment = async (req, res, next) => {
  const id = req.params.id;

  const comment = await CommentsModel.findOne({ _id: id });

  CommentsModel.deleteOne({ _id: id }, (err, result) => {
    res.redirect("/home/posts/" + comment.originalPost);
  });
};
