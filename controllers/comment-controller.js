const CommentsModel = require("../models/CommentsModel.js");
const UserModel = require("../models/userModel.js");
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

    const commentId = comment._id;

    CommentsModel.findOne({ _id: commentId })
      .populate("postedBy")
      .populate("originalPost")
      .exec(function (err, post) {
        console.log("Post log:" + comment);
      });

    PostsModel.findOne({ _id: postId }).populate("comments");
  }
  res.redirect("/home/posts/" + postId);
  /* else {
    const posts = await PostsModel.find()
      .sort([["time", "desc"]])
      .lean();

    res.render("/home", {
      posts,
      content: post.content,
      error: "Du måste skriva något",
    });
  }*/
};
