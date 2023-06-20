const express = require("express");
const router = express.Router();
const cuisineController = require("./cuisine.controller");

router.get("/getcuisine", cuisineController.getCuisine);

module.exports = router;
