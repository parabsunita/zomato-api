const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant.controller");

router.get("/notVerifiedResturant", restaurantController.notVerifiedResturant);
router.get("/notVerifiedItem", restaurantController.notVerifiedItem);
router.get("/findResturant/:id", restaurantController.findResturant);
module.exports = router;
