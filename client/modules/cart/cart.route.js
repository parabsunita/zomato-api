const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
router.post("/addtocart", cartController.addToCart);
router.get("/catdetails/:userId", cartController.cartDetails);
router.post("/updatecart", cartController.updateCart);
module.exports = router;
