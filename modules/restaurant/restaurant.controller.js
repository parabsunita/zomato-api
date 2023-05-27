const Restaurant = require("../../models/restaurant.model");
const User = require("../../models/user.model");
const Cuisine = require("../../models/cuisine.model");
async function addRestaurant(req, res) {
  const name = req.body.name;
  const user_id = req.body.user_id;
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
  const approval_status = req.body.approval_status;
  const rejection_season = req.body.rejection_season;

  try {
    let user = await User.findOne({ _id: user_id });
  } catch (err) {
    res.send({
      error: true,
      message: "User not Found",
    });
    return;
  }

  try {
    let cuisine = await Cuisine.findOne({ _id: cuisines });
  } catch (err) {
    res.send({
      error: true,
      message: "Cuisine not Found",
    });
    return;
  }

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
    user_id,
    latitude,
    longitude,
    contact,
    email,
    address,
    cuisines,
    time_slots,
    opening_days,
    approval_status,
    resturant_images,
    food_images,
    rejection_season,
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

async function checkCuisine() {
  try {
    let Cuisine = await Cuisine.findOne({ _id: cuisines });
    if (!Cuisine) {
      availability = false;
    } else {
      availability = true;
    }
  } catch (err) {
    availability = false;
  }
}

module.exports = { addRestaurant, details };
