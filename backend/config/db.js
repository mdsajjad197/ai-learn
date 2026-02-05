import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'antigravity' // Ensure specific DB usage
        });

        isConnected = conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not exit process in serverless env
        // process.exit(1); 
        throw new Error("Database connection failed");
    }
};

export default connectDB;
