const { Schema, model, mongoose } = require("mongoose");
const cartModel = new Schema(
  {
    bookId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartModel);
module.exports = Cart;
