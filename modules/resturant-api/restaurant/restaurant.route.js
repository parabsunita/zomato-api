const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant.controller");

router.post("/addrestaurant", restaurantController.addRestaurant);
router.get("/details", restaurantController.details);

module.exports = router;
