const express = require("express");
const router = express.Router();
const cuisineController = require("./cuisine.controller");

router.get("/getcuisine", cuisineController.getCuisine);
router.get("/addcuisine", cuisineController.addCuisine);
module.exports = router;
