import mongoose from "mongoose"
const  connectDb = async()=>{
    try {     
      mongoose.connect(`mongodb+srv://everich:Yaw0544971151@cluster0.y2tn6rt.mongodb.net/?retryWrites=true&w=majority`)
    } catch (error) {
      console.log(error);
    }
  }
export default connectDb;