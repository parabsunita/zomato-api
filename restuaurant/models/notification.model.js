const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  body: {
    type: String,
    require: true,
  },
  image_url: {
    type: String,
    require: true,
  },
  topic: {
    type: String,
    require: true,
  },
  delivery_date: {
    type: Date,
    require: true,
  },
  delivery_status: {
    type: String,
    enum: ["PENDING", "DELIVERED"],
    default: "PENDING",
    require: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
