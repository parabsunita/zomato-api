const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant.controller");

router.get("/resturant/:id", restaurantController.retrieveCatalogueWithItems);

module.exports = router;
