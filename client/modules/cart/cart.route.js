const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
router.post("/addtocart", cartController.addToCart);
router.get("/cartdetails/:user", cartController.cartDetails);
router.post("/updatecart", cartController.updateCart);
router.post("/removeitem/:user/:itemId", cartController.removeItem);
module.exports = router;
