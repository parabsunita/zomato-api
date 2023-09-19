const Catalogue = require("../../../models/catalogue.model");
const Item = require("../../../models/item.model");
const mongoose = require("mongoose");
const Restaurant = require("../../../models/restaurant.model");

async function addCatalogue(req, res) {
  // const catalogue = await Catalogue.findOne({});
  // if (!catalogue) {
  //   res.send({
  //     error: true,
  //     message: "Referenced Catalogue not found",
  //   });
  //   return;
  // }
  // Check if the referenced restaurant exist
  const restaurant_id = req.body.restaurant_id;
  const restaurant = await Restaurant.findById(req.body.restaurant_id);

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

  const savedcatalogue = await Catalogue.create({
    restaurant_id,
    categories: [],
  });

  res.send({
    error: false,
    message: "catalogue added successfully",
    data: {
      catalogue: savedcatalogue._id,
    },
  });
}

async function getCatalogue(req, res) {
  const catalogue = await Catalogue.aggregate([
    {
      $match: {
        restaurant_id: new mongoose.Types.ObjectId(req.params.id), // Replace with the actual restaurant ID
      },
    },
    {
      $lookup: {
        from: "items", // Replace with the actual collection name for items
        localField: "categories.items",
        foreignField: "_id",
        as: "itemsDetails",
      },
    },
    {
      $project: {
        _id: 1,
        restaurant_id: 1,
        categories: {
          $map: {
            input: "$categories",
            as: "category",
            in: {
              name: "$$category.name",
              items: "$itemsDetails",
            },
          },
        },
      },
    },
  ]);

  res.json(catalogue);
}
async function getAllCatalogue(req, res) {
  const catalogue = await Catalogue.find();
  console.log(catalogue);
  res.send({
    catalogue,
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
  const catalog = await Catalogue.findOne({ "categories._id": category_id });
  console.log(catalog);
  const category = await catalog.categories.find((category) => {
    console.log(category._id.toString(), category_id);
    if (category._id.toString() == category_id) {
      return category;
    }
  });
  console.log(category);
  if (!category) {
    res.send({
      error: true,
      message: "category doesn't gcj exists",
    });
    return;
  }
  let item = await Item.findOne({ name: name });
  console.log(item);
  if (item) {
    res.send({
      error: true,
      message: "item already exists",
    });
    return;
  }

  let newItem = {
    name,
    price,
    description,
    img_url,
    is_veg,
    approval_status,
    resjection_reason,
  };

  const savedItem = await Item.create(newItem);

  category.items.push(savedItem._id.toString());
  catalog.save();
  res.send({
    error: false,
    message: "gff",
  });
}

async function details(req, res) {
  const name = req.query.name ? req.query.name.split(",") : [];
  console.log(name);
  let Items = await Item.getItem({ name: name });

  res.send({
    Items,
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

  res.send({
    item: item,
  });
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

  if (category) {
    res.send({
      error: true,
      message: "Category with the same name already exists",
    });
    return;
  }

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
    message: "Category added successfully!!!!",
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
  getAllCatalogue,
  addItem,
  details,
  editItem,
  addCategory,
  getCategory,
};
