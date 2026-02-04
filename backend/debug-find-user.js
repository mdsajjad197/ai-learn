import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testFind = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const id = "6982e7efbb7fb515";
        console.log(`Testing findById with ID: "${id}"`);

        try {
            const user = await User.findById(id);
            console.log("Result:", user);
        } catch (err) {
            console.log("Caught Error during findById:");
            console.log(err.message);
            console.log("Error Name:", err.name);
        }

        process.exit(0);
    } catch (error) {
        console.error("Connection Error:", error);
        process.exit(1);
    }
};

testFind();
