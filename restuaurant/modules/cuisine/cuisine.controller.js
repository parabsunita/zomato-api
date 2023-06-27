const Cuisine = require("../../../models/cuisine.model");

async function getCuisine(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];

  const code = req.query.code == undefined ? "" : req.query.code;

  let cuisine = await Cuisine.find();

  res.send({
    cuisine,
  });
}

module.exports = { getCuisine };
