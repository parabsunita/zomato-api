const Item = require("../../../models/item.model");

async function addItem(req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const img_url = req.body.img_url;
  const is_veg = req.body.is_veg;
  const approval_status = req.body.approval_status;
  const resjection_status = req.body.resjection_status;

  let item = await Item.findOne({ name: name });

  if (item) {
    res.send({
      error: true,
      message: "item already exists",
    });
    return;
  }

  let newResturant = {
    name,
    price,
    description,
    img_url,
    is_veg,
    approval_status,
    resjection_status,
  };

  const savedRestuarant = await Item.create(newResturant);

  res.send({
    error: false,
    message: "Item added successfully",
    data: {
      name: savedRestuarant.name,
    },
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
module.exports = { addItem, details, editItem };
