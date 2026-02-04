import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsersJson = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log("JSON_OUTPUT_START");
        console.log(JSON.stringify(users, null, 2));
        console.log("JSON_OUTPUT_END");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsersJson();
