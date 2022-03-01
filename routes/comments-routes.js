const express = require("express");

const commentController = require("../controllers/comment-controller.js");

const router = express.Router();

//router.get("/", commentController.getComments);

router.post("/", commentController.postNewComment);

module.exports = router;
