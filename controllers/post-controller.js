const UserModel = require("../models/userModel");

exports.getPosts = async (req, res, next) => {
  const allUsers = await UserModel.find()
    .sort([["time", "desc"]])
    .lean();

  const posts = [];

  for (const item of allUsers) {
    for (const post of item.posts) {
      posts.push(post);
    }
  }
  console.log(posts);

  res.render("home", { posts });
};

exports.postNewPost = async (req, res, next) => {
  const content = req.body.content;

  const id = res.locals.id;

  UserModel.findByIdAndUpdate(
    id,
    {
      $push: { posts: { content, author: res.locals.username } },
    },
    (err, result) => {
      res.redirect("home");
    }
  );
};
