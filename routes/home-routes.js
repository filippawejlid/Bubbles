const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home-controller");
const commentController = require("../controllers/comment-controller.js");
const settingsController = require("../controllers/settings-controller.js");

router.get("/", homeController.getPosts);

router.post("/", homeController.postNewPost);

router.get("/posts/:id", homeController.getSinglePost);

router.get("/edit-post/:id", homeController.getEditPost);

router.post("/edit-post/:id", homeController.postEditPost);

router.get("/delete-post/:id", homeController.getDeletePost);

router.post("/delete-post/:id", homeController.postDeletePost);

router.get("/profile/:id", homeController.getUserSingle);

router.get("/settings", settingsController.getSettings);

router.post("/settings/change-image", settingsController.postNewPicture);

router.post("/settings/edit-username", settingsController.postEditUser);

router.post("/settings/edit-email", settingsController.postEditEmail);

router.post("/settings/delete", settingsController.postDeleteUser);

router.post("/posts/:id", commentController.postNewComment);

router.get("/edit-comment/:id", commentController.getEditComment);

router.post("/edit-comment/:id", commentController.postEditComment);

router.get("/delete-comment/:id", commentController.getDeleteComment);

router.post("/delete-comment/:id", commentController.postDeleteComment);

router.get("/logout", homeController.getLogout);

module.exports = router;
