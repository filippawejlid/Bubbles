const express = require("express");
const passport = require("passport");
const router = express.Router();

const startController = require("../controllers/start-controller.js");

router.get("/google", startController.googleAuthRoute);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  startController.googleSuccessCallback
);

module.exports = router;
