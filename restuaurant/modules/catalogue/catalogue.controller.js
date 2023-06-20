const Catalogue = require("../../models/catalogue.model");

async function addCatalogue(req, res) {
  const name = req.body.name;
  const status = req.body.status;

  let catalogue = await Catalogue.findOne({ name: name });

  if (cuisine) {
    res.send({
      error: true,
      message: "catalogue already exists",
    });
    return;
  }

  let newcuisine = {
    name,
    status,
  };

  const savedcuisine = await Catalogue.create(newcuisine);

  res.send({
    error: false,
    message: "cuisine added successfully",
    data: {
      name: savedcuisine.name,
      code: savedcuisine.status,
    },
  });
}

async function getCatalogue(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];

  const code = req.query.code == undefined ? "" : req.query.code;

  let cuisine = await Catalogue.getCatalogues({ name: name });

  res.send({
    cuisine,
  });
}

module.exports = { addCatalogue, getCatalogue };
