import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminUser = {
            name: 'Admin',
            email: 'admin', // Using 'admin' as requested
            password: 'admin123',
            role: 'admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        };

        // Check if exists
        const user = await User.findOne({ email: adminUser.email });

        if (user) {
            user.password = adminUser.password;
            user.role = 'admin';
            user.name = 'Admin';
            await user.save();
            console.log('Admin user updated (password reset)');
        } else {
            await User.create(adminUser);
            console.log('Admin user created');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
