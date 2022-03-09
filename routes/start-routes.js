const express = require("express");
const router = express.Router();

const startController = require("../controllers/start-controller");

router.get("/register", startController.getRegister);

router.post("/register", startController.postRegister);

router.get("/login", startController.getLogin);

router.post("/login", startController.postLogin);

module.exports = router;
