// routes/cart.js
const express = require("express");
const router = express.Router();
const Item = require("../../../models/item.model");
const Cart = require("../../../models/cart.model"); // Import the Cart model

// Add an item to the cart
async function addToCart(res, req) {
  try {
    const { itemId, userId } = req.body;

    if (!itemId || !userId) {
      return res.status(400).json({
        message: "Both itemId and userId are required in the request body",
      });
    }

    const menuItem = await Item.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Assume you have a User model and can associate the cart with a user here
    // const user = await User.findById(userId);

    // Find or create a cart for the user
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      const newCart = new Cart({
        user: userId,
        items: [{ menuItem: menuItem._id, quantity: 1 }],
      });
      await newCart.save();
    } else {
      // Check if the item is already in the cart
      const existingCartItem = userCart.items.find(
        (item) => item.menuItem.toString() === itemId
      );

      if (existingCartItem) {
        // Increment the quantity if the item is already in the cart
        existingCartItem.quantity += 1;
      } else {
        // Add the item to the cart
        userCart.items.push({ menuItem: itemId, quantity: 1 });
      }

      await userCart.save();
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
async function cartDetails(res, req) {
  {
    try {
      const userId = req.params.userId;
      const userCart = await Cart.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "item", // The name of the MenuItem collection
            localField: "item.menuItem",
            foreignField: "_id",
            as: "items.menuItemDetails",
          },
        },
        {
          $unwind: "$items.menuItemDetails",
        },
        {
          $group: {
            _id: "$_id",
            user: { $first: "$user" },
            items: {
              $push: {
                menuItem: "$items.menuItemDetails",
                quantity: "$items.quantity",
              },
            },
          },
        },
      ]);

      if (!userCart || userCart.length === 0) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.json({ cart: userCart[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
async function updateCart(res, req) {
  try {
    const { itemId, userId, quantity } = req.body;

    if (!itemId || !userId || !quantity) {
      return res.status(400).json({
        message:
          "itemId, userId, and quantity are required in the request body",
      });
    }

    const menuItem = await Item.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Assume you have a User model and can associate the cart with a user here
    // const user = await User.findById(userId);

    // Find the user's cart
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the user's cart
    const cartItem = userCart.items.find(
      (item) => item.menuItem.toString() === itemId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Update the item quantity
    cartItem.quantity = quantity;

    await userCart.save();

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = { addToCart, cartDetails, updateCart };
