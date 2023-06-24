const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
      required: true,
    },
    is_veg: { type: Boolean, default: false },
    approval_status: {
      type: String,
      enum: {
        values: ["PENDING", "REJECTED", "VERIFIED"],
        message: "Invalid Approval Status",
      },
      default: "PENDING",
      required: true,
    },
    resjection_reason: {
      type: String,
      required: true,
    },
  },
  {
    collation: { locale: "en_US", strength: 1 },
    usePushEach: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
itemSchema.statics.getItem = (name) => {
  let query = Item.find();

  console.log(name.name.length);

  if (name.name.length > 0) {
    query.where("name").in(name.name[0]);
  }

  return query;
};
itemSchema.statics.updateItem = (_id, updateId) => {
  query1 = Item.find();
  query1.where("_id").in(_id);
  console.log(query1.item);
  const query = I.updateOne({ _id: _id }, { $set: { _id: updatename } });

  return query;
};
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
