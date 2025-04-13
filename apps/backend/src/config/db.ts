import mongoose from "mongoose";
import { logInfo } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string);

  logInfo(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
