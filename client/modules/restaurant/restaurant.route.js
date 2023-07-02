const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant.controller");

router.get(
  "/resturant/:restaurantId",
  restaurantController.retrieveCatalogueWithItems
);

router.post("/resturant", restaurantController.getRestaurantOnCordinates);
module.exports = router;
