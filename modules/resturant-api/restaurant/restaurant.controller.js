const Restaurant = require("../../../models/restaurant/restaurant.model");

async function addRestaurant(req, res) {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const contact = req.body.contact;
  const email = req.body.email;
  const address = req.body.address;
  const cuisines = req.body.cuisines;
  const time_slots = req.body.time_slots;
  const opening_days = req.body.opening_days;
  const resturant_images = req.body.resturant_images;
  const food_images = req.body.food_images;

  let resturant = await Restaurant.findOne({ name: name });

  if (resturant) {
    res.send({
      error: true,
      message: "restuarant already exists",
    });
    return;
  }

  let newResturant = {
    name,
    latitude,
    longitude,
    contact,
    email,
    address,
    cuisines,
    time_slots,
    opening_days,
    resturant_images,
    food_images,
  };

  const savedRestuarant = await Restaurant.create(newResturant);

  res.send({
    error: false,
    message: "Resturant added successfully",
    data: {
      name: savedRestuarant.name,
    },
  });
}

async function details(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];
  console.log(name);
  let resturants = await Restaurant.getRestaurant({ name: name });

  res.send({
    resturants,
  });
}

module.exports = { addRestaurant, details };
