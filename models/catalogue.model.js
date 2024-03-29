const mongoose = require("mongoose");

const catalogueSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    categories: [
      {
        name: {
          type: String,
          required: true,
        },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
      }, // it was missing here
    ],
  },
  {
    collation: { locale: "en_US", strength: 1 },
    usePushEach: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
catalogueSchema.statics.getCatalogue = (name) => {
  let query = Catalogue.find();

  console.log(name.name.length);

  if (name.name.length > 0) {
    query.where("name").in(name.name[0]);
  }

  return query;
};

const Catalogue = mongoose.model("Catalogue", catalogueSchema);
module.exports = Catalogue;
