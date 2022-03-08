const express = require("express");

const commentController = require("../controllers/comment-controller.js");

const router = express.Router();

//router.get("/", commentController.getComments);

router.post("/posts/:id", commentController.postNewComment);

router.get("/edit-comment/:id", commentController.getEditComment);

router.post("/edit-comment/:id", commentController.postEditComment);

router.get("/delete-comment/:id", commentController.getDeleteComment);

router.post("/delete-comment/:id", commentController.postDeleteComment);

module.exports = router;
