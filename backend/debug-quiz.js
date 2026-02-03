import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuiz } from './services/aiService.js';
import Document from './models/Document.js';

const filename = fileURLToPath(import.meta.url);
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
        // Get the most recent document
        const doc = await Document.findOne().sort({ createdAt: -1 });

        if (!doc) {
            console.log('No documents found.');
            process.exit(0);
        }

        console.log(`Testing Quiz Generation for doc: ${doc.name}`);
        console.log(`Content length: ${doc.content ? doc.content.length : 0}`);
        console.log(`Sample content: ${doc.content ? doc.content.substring(0, 100) : 'None'}`);

        if (!doc.content || doc.content.length < 50) {
            console.warn('Document content is too short/empty. Quiz gen might fail.');
        }

        try {
            const quiz = await generateQuiz(doc.content, doc.name);
            console.log('Quiz Generation Successful!');
            // console.log(JSON.stringify(quiz, null, 2));
            quiz.forEach((q, i) => {
                console.log(`Q${i + 1}: ${q.question}`);
                console.log(`Answer: ${q.answer}`);
                console.log(`Explanation: ${q.explanation}`);
                console.log('---');
            });
        } catch (error) {
            console.error('Quiz Generation Failed inside script:');
            console.error(error);
        }

        process.exit(0);
    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
};

run();
