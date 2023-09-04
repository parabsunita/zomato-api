var express = require("express");
var router = express.Router();
const restaurantRouter = require("./modules/restaurant/restaurant.route");
const cartRouter = require("./modules/cart/cart.route");

router.use("/restaurant", restaurantRouter);
router.use("/cart", cartRouter);
module.exports = router;
