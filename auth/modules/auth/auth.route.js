const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/details", authController.details);

module.exports = router;
