import mongoose from "mongoose"
const { MONGODB_URI } = process.env

// connection function
export const connectDB = async () => {
  const conn = await mongoose
    .connect(MONGODB_URI as string)
    .catch(err => console.log(err))

  return conn
}