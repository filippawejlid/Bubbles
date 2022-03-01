const PostsModel = require("../models/PostsModel");
const UserModel = require("../models/userModel");
const { validatePost } = require("../utils");

exports.getPosts = async (req, res, next) => {
  const posts = await PostsModel.find()
    .populate("postedBy")
    .sort([["time", "desc"]])
    .lean();

  console.log(posts);

  res.render("home", { posts });
};

exports.postNewPost = async (req, res, next) => {
  const userId = res.locals.id;
  const content = req.body.content;

  const post = new PostsModel({ postedBy: userId, content });

  if (validatePost(post)) {
    await post.save();

    const postId = post._id;

    PostsModel.findOne({ _id: postId })
      .populate("postedBy")
      .exec(function (err, post) {
        console.log("Post log:" + post);
      });

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
