const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },

    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cuisines: {
      type: String,
      required: true,
    },

    time_slots: {
      type: String,
      required: true,
    },
    opening_days: {
      type: String,
      required: true,
    },
    approval_status: {
      type: String,
      enum: ["PENDING", "REJECTED", "VERIFIED"],
      required: true,
    },
    resturant_images: {
      type: String,
      required: true,
    },
    food_images: {
      type: String,
      required: true,
    },
    rejection_season: {
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
restaurantSchema.statics.getRestaurant = (name) => {
  let query = Restaurant.find();

  console.log(name.name.length);

  if (name.name.length > 0) {
    query.where("name").in(name.name[0]);
  }

  return query;
};
restaurantSchema.statics.updateResturant = (_id, updateId) => {
  query1 = Restaurant.find();
  query1.where("_id").in(_id);
  console.log(query1.restaurant);
  const query = I.updateOne({ _id: _id }, { $set: { _id: updatename } });

  return query;
};
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
