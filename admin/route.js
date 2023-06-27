var express = require("express");
var router = express.Router();

const cuisineRouter = require("./modules/cuisine/cuisine.route");
const restaurantRouter = require("./modules/restaurant/restaurant.route");

router.use("/cusine", cuisineRouter);
router.use("/resturant", restaurantRouter);

module.exports = router;
