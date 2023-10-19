const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");

router.post("/createpayment", paymentController.createpayment);
router.post("/details", paymentController.details);

module.exports = router;
