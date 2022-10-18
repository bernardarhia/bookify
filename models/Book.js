import { Schema, model, mongoose } from "mongoose";
const bookModel = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// bookModel.pre("save", async function (next) {

//   const bookExists = await Book.findOne({ title: this.title });
//   if (bookExists) throw new Error("Book already exists");
//   next();
// });

const Book = model("Book", bookModel);
export default Book
