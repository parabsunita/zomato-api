const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/details", authController.details);
router.post("/addadress/:userId", authController.addAddress);

module.exports = router;
