const mongoose = require("mongoose");
const Catalogue = require("../../../models/catalogue.model");
const Item = require("../../../models/item.model");
const Restaurant = require("../../../models/restaurant.model");
async function retrieveCatalogueWithItems(req, res) {
  const { restaurantId } = req.params;
  const catalogue = await Catalogue.aggregate([
    {
      $match: {
        restaurant_id: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "categories.items",
        foreignField: "_id",
        as: "categories.items",
      },
    },
  ]);

  if (!catalogue || catalogue.length === 0) {
    return res.status(404).json({ message: "Catalogue not found" });
  }

  res.send({
    catelouge: catalogue,
  });
}
async function getRestaurantOnCordinates(req, res) {
  const { latitude, longitude, search_term } = req.query;
  console.log(search_term);
  // Create the geospatial index

  const pipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        distanceField: "distance",
        maxDistance: 200,
        spherical: true,
        key: "location",
      },
    },
    {
      $match: {
        $or: [
          { name: { $regex: search_term, $options: "i" } },
          { cuisines: { $regex: search_term, $options: "i" } },
        ],
      },
    },
  ];

  // Execute the aggregation pipeline
  const restaurants = await Restaurant.aggregate(pipeline);

  res.json(restaurants);
}
module.exports = { retrieveCatalogueWithItems, getRestaurantOnCordinates };
