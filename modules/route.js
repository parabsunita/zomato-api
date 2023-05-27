var express = require("express");
var router = express.Router();
const authRouter = require("./auth/auth.route");
// const catalogueRouter = require("./catalogue/catalogue.route");
const cuisineRouter = require("./cuisine/cuisine.route");
const itemRouter = require("./item/item.route");
const restaurantRouter = require("./restaurant/restaurant.route");

router.use("/auth", authRouter);
// router.use("/catalogue", catalogueRouter);
router.use("/cuisine", cuisineRouter);
router.use("/resturant", restaurantRouter);
router.use("/item", itemRouter);
module.exports = router;
