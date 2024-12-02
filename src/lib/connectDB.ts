import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

const  connectDB: ()=> Promise<void> = async () => {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(`${process.env.MONGO_URI}`)

    connection.isConnected = db.connections[0].readyState;

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}
export default connectDB;