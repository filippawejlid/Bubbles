const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 8);
  return hashValue;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

const forceAuthorize = (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    // res.redirect("/home");
    next();
  } else {
    res.redirect("/start/login");
  }
};

const forceRedirect = (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.redirect("/home");
  } else {
    res.redirect("/start/login");
  }
};

module.exports = {
  forceAuthorize,
  forceRedirect,
  hashPassword,
  comparePassword,
};
