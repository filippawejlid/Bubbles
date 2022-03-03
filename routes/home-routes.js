const express = require("express");

const postController = require("../controllers/home-controller");

const router = express.Router();

router.get("/", postController.getPosts);

router.get("/posts/:id", postController.getPost);

router.post("/", postController.postNewPost);

module.exports = router;
