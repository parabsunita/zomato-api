const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant.controller");

router.post("/addrestaurant", restaurantController.addRestaurant);
router.get("/details", restaurantController.details);
router.get("/findResturant/id", restaurantController.findResturant);
router.get("/editResturant/id", restaurantController.editResturant);
module.exports = router;
