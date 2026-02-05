import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pdf from 'pdf-parse/lib/pdf-parse.js';
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
        const docs = await Document.find({
            $or: [
                { content: { $regex: 'Error extracting text' } },
                { content: 'No textual content extracted.' }
            ]
        });

        console.log(`Found ${docs.length} documents to reprocess.`);

        for (const doc of docs) {
            console.log(`Processing: ${doc.name} (${doc._id})`);

            if (!doc.url) {
                console.log(' - No URL found, skipping.');
                continue;
            }

            // Fix path if it's relative or has wrong separators
            // doc.url might be full path or relative from previous upload logic
            // Ideally we check if it exists as is, or join with __dirname/uploads?
            // "url": "c:\\Users\\Sajja\\...\\uploads\\file-..."

            let filePath = doc.url;
            // Validate existence
            if (!fs.existsSync(filePath)) {
                // Try relative to current script if path is just filename or relative
                const relativePath = path.join(__dirname, filePath);
                if (fs.existsSync(relativePath)) {
                    filePath = relativePath;
                } else {
                    console.log(` - File not found at ${filePath}, skipping.`);
                    continue;
                }
            }

            if (doc.type === 'application/pdf') {
                try {
                    const dataBuffer = fs.readFileSync(filePath);
                    const data = await pdf(dataBuffer);

                    doc.content = data.text;
                    await doc.save();
                    console.log(` - Success! Extracted ${data.text.length} chars.`);
                } catch (pError) {
                    console.error(` - Parsing Failed:`, pError.message);
                    doc.content = `Error extracting text from PDF: ${pError.message}`;
                    await doc.save();
                }
            } else {
                console.log(' - Not a PDF, skipping.');
            }
        }

        console.log('Reprocessing complete.');
        process.exit(0);
    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
};

run();
