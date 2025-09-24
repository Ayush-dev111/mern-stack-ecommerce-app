import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const connectDb = async () =>{
    try {
        const connectingDb = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Successfully connected :", connectingDb.connection.host);
    } catch (error) {
        console.log("error in connecting database:", error);
    }
}