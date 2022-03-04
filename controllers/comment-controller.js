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
