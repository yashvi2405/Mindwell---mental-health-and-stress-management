import mongoose from 'mongoose';

let isConnected = false;

async function connectDB() {
  if (isConnected) return; // Prevent multiple connections

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

export { connectDB, isConnected };
