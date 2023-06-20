const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,

      required: true,
      enum: {
        values: ["admin", "client", "restaurant"],
        message: "Invalid User type.",
      },
      validate: {
        validator: function (v) {
          return v.length > 1;
        },
        message: "You must provide more than 1 tag.",
      },
    },
  },
  {
    collation: { locale: "en_US", strength: 1 },
    usePushEach: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("User", userSchema);
