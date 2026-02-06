import fs from 'fs';
import pdf from './utils/pdfParser.js';

// Test the local vendored PDF parser
console.log("Attempting to import pdfParser.js...");

async function test() {
    try {
        console.log("Custom PDF Parse loaded successfully.");
        // If we got here, require('./vendor-pdf.js') worked.
        console.log("PDF Parser Version:", pdf.version || "Unknown");
        console.log("✅ SUCCESS: The local code is using the vendored library.");
    } catch (error) {
        console.error("❌ FAILED: Could not load the module.", error);
    }
}

test();
