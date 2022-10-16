import mongoose from "mongoose";
const connectDb = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/foodify");
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};
export default connectDb;
