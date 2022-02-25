require("dotenv").config();
require("./mongoose");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const UserModel = require("./models/userModel.js");
const auth = require("./middlewares/auth.js");
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

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.username = tokenData.username;
  } else {
    res.locals.loggedIn = false;
  }


  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/register", registerRoutes);
app.use("/login", loginRouter);

=======
  next();
});


app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
