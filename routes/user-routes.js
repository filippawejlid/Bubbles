const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

router.get("/", userController.getUserPage);

router.get("/register", userController.getRegister);

router.post("/register", userController.postRegister);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/edit-post/:id", userController.getEditPost);

router.post("/edit-post/:id", userController.postEditPost);

router.post("/delete-post/:id", userController.postDeletePost);

router.get("/settings", userController.getSettings);

router.post("/settings/change-image", userController.postNewPicture);

router.post("/settings/edit-username", userController.postEditUser);

router.post("/settings/edit-email", userController.postEditEmail);

router.post("/settings/delete", userController.postDeleteUser);

router.get("/logout", userController.getLogout);

module.exports = router;
