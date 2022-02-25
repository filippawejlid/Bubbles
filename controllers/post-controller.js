const UserModel = require("../models/userModel");

exports.getPosts = async (req, res, next) => {
  const allUsers = await UserModel.find()
    .sort([["time", "desc"]])
    .lean();

  const users = [];

  for (const item of allUsers) {
    console.log(item + "hej");
    if (item.posts.length > 0) {
      users.push(item);
    }
  }

  res.render("home", { users });
};

exports.postNewPost = async (req, res, next) => {
  const content = req.body.content;

  const id = res.locals.id;

  UserModel.findByIdAndUpdate(
    id,
    {
      $push: { posts: { content } },
    },
    (err, result) => {
      res.redirect("home");
    }
  );
};
