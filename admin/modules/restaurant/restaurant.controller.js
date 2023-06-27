const Restaurant = require("../../../models/restaurant.model");
const Item = require("../../../models/item.model");
async function notVerifiedResturant(req, res) {
  const approval_status = req.query.approval_status;
  const restaurants = await Restaurant.find({
    approval_status: { $in: [approval_status] },
  });
  res.send({
    error: false,
    restaurants: restaurants,
  });
}
async function findResturant(req, res) {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  res.send({
    error: false,
    restaurant: restaurant,
  });
}
async function notVerifiedItem(req, res) {
  const approval_status = req.query.approval_status;
  const Items = await Item.find({
    approval_status: { $in: [approval_status] },
  });
  res.send({
    error: false,
    Items: Items,
  });
}
module.exports = { notVerifiedResturant, notVerifiedItem, findResturant };
