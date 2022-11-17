const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    productId: {
      require: true,
      ref: "Product",
      type: mongoose.Types.ObjectId,
    },
    userId: {
      require: true,
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
    quantity: {
      require: true,
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
