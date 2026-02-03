import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Attempting to connect with URI:", process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
        process.exit(0);
    } catch (error) {
        console.error("Connection Error:", error);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        process.exit(1);
    }
};

connectDB();
