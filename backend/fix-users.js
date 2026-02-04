import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const targetEmail = "raazi@gmail.com";
        console.log(`Attempting to delete user with email: ${targetEmail}`);

        const result = await User.deleteMany({ email: targetEmail });

        console.log(`Deletion Result:`, result);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixUsers();
