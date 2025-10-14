import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
          process.env.MONGODB_URI
        );
        console.log(`DB Connected`);
                
    } catch (error) {
        console.log("DataBase connection failed! ", error);
        process.exit(1);
    }
}
export default connectDB;