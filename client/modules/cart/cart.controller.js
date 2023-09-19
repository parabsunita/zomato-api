// routes/cart.js
const mongoose = require("mongoose");

const Item = require("../../../models/item.model");
const Cart = require("../../../models/cart.model"); // Import the Cart model

// Add an item to the cart
async function addToCart(req, res) {
  console.log(req.body);
  const user = req.body.user;
  const items = req.body.items;
  const resturant_id = req.body.resturant_id;

  if (!user || !resturant_id) {
    return res.status(400).json({
      message: "Both user and restaurant_id are required in the request body",
    });
  }

  const menuItem = await Item.findById(items[0].menuItem);

  if (!menuItem) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Find any existing carts for this user
  const existingCarts = await Cart.find({ user: user });

  // Check if there is an existing cart for a different restaurant
  const differentRestaurantCart = existingCarts.find(
    (cart) => cart.resturant_id !== resturant_id
  );

  if (differentRestaurantCart) {
    // If there's a cart for a different restaurant, delete it
    await Cart.findByIdAndRemove(differentRestaurantCart._id);
  }

  // Find or create a cart for the user and restaurant
  let userCart = await Cart.findOne({
    user: user,
    resturant_id: resturant_id,
  });

  if (!userCart) {
    // If no cart exists for this user and restaurant, create a new one
    userCart = new Cart({
      user: user,
      resturant_id: resturant_id,
      items: [{ menuItem: menuItem._id, quantity: 1 }],
    });
  } else {
    // Check if the item is already in the cart
    const existingCartItem = userCart.items.find(
      (item) => item.menuItem.toString() === items[0].menuItem
    );

    if (existingCartItem) {
      // Increment the quantity if the item is already in the cart
      existingCartItem.quantity += 1;
    } else {
      // Add the item to the cart
      userCart.items.push({ menuItem: items[0].menuItem, quantity: 1 });
    }
  }

  // Save the cart
  await userCart.save();

  res.send({
    userCart,
  });
}
async function cartDetails(req, res) {
  const user = req.params.user;
  const userCart = await Cart.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(user) },
    },
    {
      $unwind: "$items", // Unwind the items array
    },
    {
      $lookup: {
        from: "items", // The name of the MenuItem collection
        localField: "items.menuItem",
        foreignField: "_id",
        as: "items.menuItemDetails",
      },
    },
    {
      $unwind: "$items.menuItemDetails", // Unwind the menuItemDetails array
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: {
          $push: {
            menuItem: "$items.menuItemDetails",
            quantity: "$items.quantity", // Include the quantity field
          },
        },
        restaurant_id: { $first: "$resturant_id" }, // Include restaurant_id
      },
    },
  ]);

  if (!userCart || userCart.length === 0) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json({ cart: userCart[0] });
}
async function updateCart(res, req) {
  try {
    const { itemId, user, quantity } = req.body;

    if (!itemId || !user || !quantity) {
      return res.status(400).json({
        message: "itemId, user, and quantity are required in the request body",
      });
    }

    const menuItem = await Item.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Assume you have a User model and can associate the cart with a user here
    // const user = await User.findById(user);

    // Find the user's cart
    const userCart = await Cart.findOne({ user: user });

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
async function removeItem(res, req) {
  try {
    const user = req.params.user;
    const itemId = req.params.itemId;

    if (!user || !itemId) {
      return res
        .status(400)
        .json({ message: "Both user and itemId are required" });
    }

    // Find the user's cart
    const userCart = await Cart.findOne({ user: user });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the item to remove
    const itemIndex = userCart.items.findIndex(
      (item) => item.menuItem.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Remove the item from the cart
    userCart.items.splice(itemIndex, 1);

    await userCart.save();

    res.json({ message: "Item removed from the cart" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = { addToCart, cartDetails, updateCart, removeItem };
