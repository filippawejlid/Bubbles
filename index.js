require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const UserModel = require("./models/userModel.js");
const utils = require("./utils.js");
const registerRoutes = require("./routes/register-routes.js");
const loginRouter = require("./routes/login-routes.js");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/register", registerRoutes);
app.use("/login", loginRouter);

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
