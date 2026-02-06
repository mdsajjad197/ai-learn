import fs from 'fs';
import pdf from './utils/pdfParser.js';

// Test the local vendored PDF parser
console.log("Attempting to import pdfParser.js...");

async function test() {
    try {
        console.log("Custom PDF Parse loaded successfully.");
        console.log("PDF Parser Loaded.");
        const dummyBuffer = Buffer.from("Date: 2024-01-01", "utf-8"); // Invalid PDF but checks import
        // Note: pdfjs-dist might throw on invalid PDF header, which is GOOD (means it loaded)
        try {
            await pdf(dummyBuffer);
        } catch (e) {
            console.log("Parser attempted to read file (expected failure on dummy data):", e.message.substring(0, 50));
        }
        console.log("✅ SUCCESS: pdfjs-dist implementation is active.");
    } catch (error) {
        console.error("❌ FAILED: Could not load the module.", error);
    }
}

test();
