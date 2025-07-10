import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const DBConnection = async () => {
    const MONGODB_URL = process.env.MONGODB_URI;
    try {
        if (!MONGODB_URL) {
            throw new Error("MONGO_URI is not defined in the .env file");
        }
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
        console.log("DB connection established")
    } catch (error) {
        console.log("error connecting to mongodb" + error)
    }
}
