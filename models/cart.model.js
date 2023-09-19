// models/cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resturant_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
