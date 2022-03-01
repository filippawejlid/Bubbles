const CommentsModel = require("../models/CommentsModel.js");
const UserModel = require("../models/userModel.js");
const validatePost = require("../utils.js");

exports.postNewComment = async (req, res, next) => {
  const userId = res.locals.id;
  const commentContent = req.body.text;

  const comment = new CommentsModel({ postedBy: userId, commentContent });

  if (validatePost(comment)) {
    console.log(comment);
    await comment.save();

    const commentId = comment._id;

    CommentsModel.findOne({ _id: commentId })
      .populate("postedBy")
      .exec(function (err, comment) {});
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
