import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Document from './models/Document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err.message);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    try {
        const docs = await Document.find({}).sort({ createdAt: -1 });
        console.log(`Found ${docs.length} documents.`);

        docs.forEach(doc => {
            console.log('------------------------------------------------');
            console.log(`ID: ${doc._id}`);
            console.log(`Name: ${doc.name}`);
            console.log(`Type: ${doc.type}`);
            console.log(`Content Length: ${doc.content ? doc.content.length : 0}`);
            console.log(`Start of Content: "${doc.content ? doc.content.substring(0, 100).replace(/\n/g, '\\n') : 'NULL'}"`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
};

run();
