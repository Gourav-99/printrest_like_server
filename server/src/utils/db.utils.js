import mongoose from "mongoose";
import logger from "../logger";
export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI ||
        "mongodb+srv://gourav1999:test@practice.bbcptro.mongodb.net/pinCraft",
      {}
    );
    logger.warn("Connected to DB");
  } catch (error) {
    logger.error(error);
  }
};
