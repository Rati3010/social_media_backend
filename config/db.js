import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connection = mongoose.connect(process.env.mongo_url);
export { connection };