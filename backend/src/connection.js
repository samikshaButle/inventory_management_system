import mongoose from "mongoose";

const connect = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("Error while connecting to MongoDB:", error);
  }
};

export { connect };
