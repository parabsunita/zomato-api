var express = require("express");
var router = express.Router();
const restaurantRouter = require("./modules/restaurant/restaurant.route");
const cartRouter = require("./modules/cart/cart.route");
const paymentRouter = require("./modules/payment/payment.route");

router.use("/restaurant", restaurantRouter);
router.use("/cart", cartRouter);
router.use("/payment", paymentRouter);
module.exports = router;
