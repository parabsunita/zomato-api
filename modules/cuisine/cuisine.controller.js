const Cuisine = require("../../models/cuisine.model");

async function addCuisine(req, res) {
  const name = req.body.name;
  const status = req.body.status;

  let cuisine = await Cuisine.findOne({ name: name });

  if (cuisine) {
    res.send({
      error: true,
      message: "cuisine already exists",
    });
    return;
  }

  let newcuisine = {
    name,
    status,
  };

  const savedcuisine = await Cuisine.create(newcuisine);

  res.send({
    error: false,
    message: "cuisine added successfully",
    data: {
      name: savedcuisine.name,
      code: savedcuisine.status,
    },
  });
}

async function getCuisine(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];

  const code = req.query.code == undefined ? "" : req.query.code;

  let cuisine = await Cuisine.getCuisines({ name: name });

  res.send({
    cuisine,
  });
}

module.exports = { addCuisine, getCuisine };
