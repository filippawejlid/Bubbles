const UserModel = require("../models/UserModel.js");
const PostsModel = require("../models/PostsModel.js");
const auth = require("../middlewares/auth.js");
const { validatePost, getUniqueFilename } = require("../utils");
const jwt = require("jsonwebtoken");

exports.getRegister = (req, res, next) => {
  res.render("auth/register");
};

exports.postRegister = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  UserModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.send("username in use");
    } else if (password !== confirmPassword) {
      res.send("Incorrect password");
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: auth.hashPassword(password),
      });
      if (req.files.image) {
        const image = req.files.image;
        const filename = getUniqueFilename(image.name);
        const uploadPath = __dirname + "/../public/uploads/" + filename;
        await image.mv(uploadPath);

        newUser.imageUrl = "/uploads/" + filename;
      }

      await newUser.save();
      res.redirect("/user/login");
    }
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && auth.comparePassword(password, user.password)) {
      const userData = { userId: user._id.toString(), username };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);

      res.cookie("token", accessToken);
      res.redirect("/");
    } else {
      res.send("login failed");
    }
  });
};

exports.getRegister = (req, res, next) => {
  res.render("auth/register");
};

exports.getUserPage = async (req, res, next) => {
  const id = res.locals.id;

  const posts = await PostsModel.find()
    .sort([["time", "desc"]])
    .lean();
  const userPosts = [];

  posts.forEach((post) => {
    if (post.postedBy.toString() === id) {
      userPosts.push(post);
    }
  });

  res.render("user/user-page", { userPosts });
};

exports.getEditPost = async (req, res, next) => {
  const id = req.params.id;

  const post = await PostsModel.findOne({ _id: id });
  console.log(post);

  res.render("user/edit-post", post);
};

exports.postEditPost = async (req, res, next) => {
  const id = req.params.id;

  const originalPost = await PostsModel.findOne({ _id: id });

  const post = {
    content: req.body.content,
    time: Date.now(),
  };

  if (validatePost(post)) {
    PostsModel.updateOne({ _id: id }, { $set: post }, (err, result) => {
      res.redirect("/user");
    });
  } else {
    res.render("user/edit-post", {
      error: "Du måste skriva något",
      content: originalPost.content,
      _id: originalPost._id,
    });
  }
};

exports.postDeletePost = async (req, res, next) => {
  const id = req.params.id;

  PostsModel.deleteOne({ _id: id }, (err, result) => {
    res.redirect("/user");
  });
};

exports.getSettings = async (req, res, next) => {
  const user = await UserModel.findById({ _id: res.locals.id });
  res.render("user/settings", user);
};

exports.postNewPicture = async (req, res, next) => {
  const user = await UserModel.findById({ _id: res.locals.id });

  if (req.files.image) {
    const image = req.files.image;
    const filename = getUniqueFilename(image.name);
    const uploadPath = __dirname + "/../public/uploads/" + filename;
    await image.mv(uploadPath);

    user.imageUrl = "/uploads/" + filename;

    await user.save();
  }

  res.redirect("/user/settings");
};

exports.postEditUser = async (req, res, next) => {
  const { username } = req.body;

  const takenUsername = await UserModel.findOne({ username });

  UserModel.findOne({ _id: res.locals.id }, async (err, user) => {
    if (takenUsername) {
      res.render("user/settings", {
        email: user.email,
        imageUrl: user.imageUrl,
        errorUsername: "Username is already taken",
      });
    } else {
      user.username = username;

      await user.save();
      res.redirect("/user/settings");
    }
  });
};

exports.postEditEmail = async (req, res, next) => {
  const { email } = req.body;

  const takenEmail = await UserModel.findOne({ email });

  UserModel.findOne({ _id: res.locals.id }, async (err, user) => {
    if (takenEmail) {
      res.render("user/settings", {
        email: user.email,
        imageUrl: user.imageUrl,
        errorEmail: "Email is already in use",
      });
    } else {
      user.email = email;

      await user.save();
      res.redirect("/user/settings");
    }
  });
};

exports.postDeleteUser = async (req, res, next) => {
  UserModel.deleteOne({ _id: res.locals.id }, (err, result) => {
    res.cookie("token", "", { maxAge: 0 });

    res.redirect("/");
  });
};
