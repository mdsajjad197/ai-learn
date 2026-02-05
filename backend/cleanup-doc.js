import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Document from './models/Document.js';
import connectDB from './config/db.js';

dotenv.config();

const cleanUp = async () => {
    await connectDB();

    // Find documents with the specific broken URL pattern or just list all
    const problematicDoc = await Document.findOne({ fileName: 'doyuowq0qixpr9lsljex' }); // based on the url user gave

    if (problematicDoc) {
        console.log(`Found problematic document: ${problematicDoc.name}`);
        await Document.deleteOne({ _id: problematicDoc._id });
        console.log("Deleted broken document entry.");
    } else {
        console.log("No matching broken document found.");
    }

    process.exit();
};

cleanUp();
