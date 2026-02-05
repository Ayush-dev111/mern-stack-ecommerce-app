import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not defined in environment variables");
      process.exit(1);
    }
    const connectingDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Database Successfully connected:",
      connectingDb.connection.host,
    );
  } catch (error) {
    console.error("Error in connecting database:", error.message);
    process.exit(1);
  }
};
