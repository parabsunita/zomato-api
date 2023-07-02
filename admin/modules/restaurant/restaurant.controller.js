const Restaurant = require("../../../models/restaurant.model");
const Item = require("../../../models/item.model");
async function notVerifiedResturant(req, res) {
  const { page, limit, approval_status } = req.query;
  const options = {
    page: page,
    limit: limit,
  };
  const query = { approval_status: { $in: [approval_status] } };
  const restaurants = await Restaurant.paginate(query, options);
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
  const { page, limit, approval_status } = req.query;
  const options = {
    page: page,
    limit: limit,
  };
  const query = { approval_status: { $in: [approval_status] } };
  const Items = await Item.paginate(query, options);

  res.send({
    error: false,
    Items: Items,
  });
}
async function updateResturantStatus(req, res) {
  const { approval_status, rejection_reason } = req.body;

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { approval_status, rejection_reason },
    { new: true }
  );
  if (!restaurant) {
    res.send({
      message: "Restaurant not found",
    });
    return;
  }

  res.send({
    message: "Status updated",
  });
}
async function updateItemStatus(req, res) {
  const { approval_status, rejection_reason } = req.body;

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { approval_status, rejection_reason },
    { new: true }
  );

  if (!item) {
    res.send({
      message: "Item not found",
    });
    return;
  }

  res.send({
    message: "Status updated",
  });
}
module.exports = {
  notVerifiedResturant,
  notVerifiedItem,
  findResturant,
  updateResturantStatus,
  updateItemStatus,
};
