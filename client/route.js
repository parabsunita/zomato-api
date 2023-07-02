var express = require("express");
var router = express.Router();
const restaurantRouter = require("./modules/restaurant/restaurant.route");

router.use("/restaurant", restaurantRouter);
module.exports = router;
