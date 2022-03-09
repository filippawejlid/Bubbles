require("dotenv").config();
require("./mongoose");
require("./passport.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { forceAuthorize } = require("./middlewares/auth.js");

const userRoutes = require("./routes/user-routes.js");
const homeRoutes = require("./routes/home-routes");
const commentRoutes = require("./routes/comments-routes.js");
const googleLoginRoutes = require("./routes/googleLogin-routes.js");
const fileUpload = require("express-fileupload");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatDate: (time) => {
        const date = new Date(time);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      },
      allowEdit: (value, value2, options) => {
        if (value.toString() === value2.toString()) {
          return options.fn(this);
        } else return options.inverse(this);
      },
    },
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload()
  //   {
  //   limits: {
  //     fileSize: 1000000, //1mb
  //   },
  //   abortOnLimit: true,
  // }
);

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.username = tokenData.username;
    res.locals.id = tokenData.userId;
  } else {
    res.locals.loggedIn = false;
  }

  next();
});

app.get("/", forceAuthorize);
app.get("/failed", (req, res) => {
  res.send("Google login failed");
});

app.use("/home", homeRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);
app.use("/", googleLoginRoutes);

app.use("/", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
