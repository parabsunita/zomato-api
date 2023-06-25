const Catalogue = require("../../models/catalogue.model");
const Item = require("../../models/item.model");
const Restaurant = require("../../models/restaurant.model");
console.log("hgjvh");
async function addCatalogue(req, res) {
  const catalogue = await Catalogue.findOne({});
  if (!catalogue) {
    res.send({
      error: true,
      message: "Referenced Catalogue not found",
    });
    return;
  } else {
  }

  // Check if the referenced restaurant exist
  const restaurant = await Restaurant.findById(req.body.restaurantid);

  if (!restaurant) {
    res.send({
      error: true,
      message: "Referenced restaurant not found",
    });
    return;
  }

  // Iterate over each category and check if the referenced items exist

  req.body.categories.forEach(async (element) => {
    for (let itemId in element.items) {
      const item = await Item.findById(element.items[itemId]);

      if (!item) {
        console.log("item");
        res.send({
          error: true,
          message: "Item not found",
        });
        return;
      }
    }
  });

  const savedcatalogue = await Catalogue.create(req.body);

  res.send({
    error: false,
    message: "catalogue added successfully",
    data: {
      catalogue: savedcatalogue._id,
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

async function addItem(req, res) {
  const name = req.body.name;
  const category_id = req.body.category_id;
  const price = req.body.price;
  const description = req.body.description;
  const img_url = req.body.img_url;
  const is_veg = req.body.is_veg;
  const approval_status = req.body.approval_status;
  const resjection_reason = req.body.resjection_reason;

  let category = await Catalogue.find({ category_id });

  if (!category) {
    res.send({
      error: true,
      message: "category already exists",
    });
    return;
  }
  let item = await Item.findOne({});

  if (!item) {
    res.send({
      error: true,
      message: "item already exists",
    });
    return;
  }

  let newItem = {
    name,
    category_id,
    price,
    description,
    img_url,
    is_veg,
    approval_status,
    resjection_reason,
  };

  const savedItem = await Item.create(newItem);

  category.push(savedItem._id.toString());

  console.log(category);
  res.send({
    error: false,
    message: `Item added successfully`,
  });
}

async function details(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];
  console.log(name);
  let resturants = await Item.getItem({ name: name });

  res.send({
    resturants,
  });
}
async function editItem(req, res) {
  const { id } = req.params;

  const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
  if (!item) {
    res.send({
      error: false,
      message: "Item not found",
    });
    return;
  }
  res.json(item);
}
async function addCategory(req, res) {
  const { name, restaurant_id } = req.body;

  const restaurant = await Restaurant.findById(restaurant_id);

  if (!restaurant) {
    res.send({
      error: true,
      message: "Referenced restaurant not found",
    });
    return;
  }

  // Get catalog by restaurant ID
  let catalog = await Catalogue.findById(restaurant_id);

  // If catalog not found, create one
  if (!catalog) {
    catalog = await Catalogue.create({
      restaurant_id,
      categories: [],
    });
  }

  // Find the category with the provided name in the catalog
  const category = catalog.categories.find((cat) => cat.name === name);

  // If category exists, throw an error (assuming unique category names)
  if (category) {
    res.send({
      error: true,
      message: "Category with the same name already exists",
    });
    return;
  }

  // Create a new category object with the provided name and an empty array of items
  const newCategory = {
    name,
    items: [],
  };

  // Add the new category to the catalog
  catalog.categories.push(newCategory);

  // Save the updated catalog
  const savedCatalog = await catalog.save();

  res.send({
    error: false,
    catalog: savedCatalog,
  });

  //saved catelouge
}
async function getCategory(req, res) {
  let categories = await Catalogue.find();

  res.send({
    categories,
  });
}
module.exports = {
  addCatalogue,
  getCatalogue,
  addItem,
  details,
  editItem,
  addCategory,
  getCategory,
};
