const { Schema, model, mongoose } = require("mongoose");
const checkoutModel = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId: {
      type: String,
      required: true,
    },
    products:{
      type:Array,
      required:true
    },
    shipping:{
      type:Object,
      required:true
    },
    payment :{
      type:Object,
      required:true
    }

  },
  { timestamps: true }
);

const Checkout = model("Checkout", checkoutModel);
module.exports = Checkout;
// , shipping: {
//   name: "Joe Dow"
// , address: "Some street 1, NY 11223"
// }
// , payment: { method: "visa", transaction_id: "2312213312XXXTD" }
// , products: cart.products