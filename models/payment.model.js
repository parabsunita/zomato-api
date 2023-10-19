const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: String,
  amount: Number,
  status: String,
});
module.exports = mongoose.model("Payment", paymentSchema);
