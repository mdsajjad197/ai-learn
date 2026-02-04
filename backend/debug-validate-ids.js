import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const validateIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        users.forEach(u => {
            const idStr = u._id.toString();
            const isValid = mongoose.isValidObjectId(idStr); // This checks if it's a 24-char hex string (mostly)

            console.log(`User: ${u.email}`);
            console.log(` - ID: ${idStr}`);
            console.log(` - Length: ${idStr.length}`);
            console.log(` - Is Valid ObjectId: ${isValid}`);

            if (!isValid || idStr.length !== 24) {
                console.log(`!!! INVALID ID DETECTED !!!`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

validateIds();
