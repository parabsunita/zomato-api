var express = require("express");
var router = express.Router();
const cuisineRouter = require("../modules/admin/cuisine.route");
const resturantRouter = require("../modules/resturant-api/restaurant/restaurant.route");
router.use("/admin/cuisine", cuisineRouter);
router.use("/resturant-api/resturant", resturantRouter);
module.exports = router;
