var express = require("express");
var router = express.Router();

const authRouter = require("../auth/route");
// const catalogueRouter = require("./catalogue/catalogue.route");
const cuisineRouter = require("./modules/cuisine/cuisine.route");
const itemRouter = require("./modules/item/item.route");
const restaurantRouter = require("./modules/restaurant/restaurant.route");

// router.use("/catalogue", catalogueRouter);
router.use("/cuisine", cuisineRouter);
router.use("/resturant", restaurantRouter);
router.use("/item", itemRouter);
module.exports = router;
