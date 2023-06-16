const express = require("express");
const router = express.Router();
const itemController = require("./item.controller");

router.post("/additem", itemController.addItem);
router.get("/details", itemController.details);

module.exports = router;
