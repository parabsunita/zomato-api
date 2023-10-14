// routes/cart.js
const mongoose = require("mongoose");
const User = require("../../../models/user.model");
const Item = require("../../../models/item.model");
const Cart = require("../../../models/cart.model"); // Import the Cart model
const Restaurant = require("../../../models/restaurant.model");

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
      userCart.items.push({
        menuItem: items[0].menuItem,
        quantity: items[0].quantity,
      });
    }
  }

  // Save the cart
  await userCart.save();

  res.send({
    message: "Item added to cart",
  });
}
async function cartDetails(req, res) {
  const user = req.params.user;
  const lattitude = req.body.lattitude;
  const langitude = req.body.langitude;

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

  const userAddress = await User.findById(user).select("address");
  console.log(userAddress);
  // const cart = await Cart.find({ user: user });
  const resturant = await Restaurant.find({
    _id: userCart[0].restaurant_id,
  });
  const resturantCord = resturant[0].location[0].coordinates;
  // res.json({ cart: resturant[0].location[0].coordinates });
  console.log(req.body.lattitude);
  const charges =
    calculateDistance(
      req.query.lattitude,
      req.query.langitude,
      resturantCord[0],
      resturantCord[1]
    ) * 10;
  // Calculate total price for each item and sum them up
  const totalPrice = userCart.reduce((acc, cartItem) => {
    const itemTotalPrice = cartItem.items.reduce((itemAcc, item) => {
      const { price } = item.menuItem;
      const { quantity } = item;
      console.log(quantity);
      itemAcc += price * quantity;
      return itemAcc;
    }, 0);

    acc += itemTotalPrice;
    return acc;
  }, 0);

  res.json({
    cart: userCart,
    charges: charges,
    totalPrice: totalPrice,
    userAddress: userAddress,
  });
}
async function updateCart(req, res) {
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
    cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity);
    if (cartItem.quantity == 0) {
      return removeItem(req, res);
    }
    await userCart.save();

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
async function removeItem(req, res) {
  const user = req.body.user;
  const itemId = req.body.itemId;

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

  res.send({ message: "Item removed from the cart" });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance) * 10;
}
module.exports = { addToCart, cartDetails, updateCart, removeItem };
