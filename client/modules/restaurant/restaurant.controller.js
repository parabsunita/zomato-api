const Catalogue = require("../../../models/catalogue.model");
const Item = require("../../../models/item.model"); // Assuming you have an `Item` model

async function retrieveCatalogueWithItems(req, res) {
  try {
    const catalogue = await Catalogue.findOne({
      restaurant_id: res.params.restaurantId,
    });

    if (!catalogue) {
      console.log("Catalogue not found");
      return;
    }

    // Populate the item details using the item IDs
    const populatedCatalogue = await catalogue
      .populate({
        path: "categories.items",
        model: Item,
      })
      .execPopulate();

    console.log(populatedCatalogue);
  } catch (error) {
    console.error("Error retrieving catalogue:", error);
  }
}

module.exports = { retrieveCatalogueWithItems };
