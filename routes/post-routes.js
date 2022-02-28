const express = require("express");

const postController = require("../controllers/post-controller");

const router = express.Router();

router.get("/", postController.getPosts);

router.post("/", postController.postNewPost);

module.exports = router;
