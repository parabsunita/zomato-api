const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
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
cuisineSchema.statics.getCuisines = (name) => {
  let query = Cuisine.find();

  console.log(name.name.length);

  if (name.name.length > 0) {
    query.where("name").in(name.name[0]);
  }

  return query;
};

const Cuisine = mongoose.model("Cuisine", cuisineSchema);
module.exports = Cuisine;
