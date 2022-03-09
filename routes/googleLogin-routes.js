const express = require("express");
const passport = require("passport");
const router = express.Router();

const userController = require("../controllers/user-controller");

router.get("/google", userController.googleAuthRoute);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  userController.googleSuccessCallback
);

module.exports = router;
