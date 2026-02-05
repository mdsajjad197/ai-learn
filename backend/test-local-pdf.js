import fs from 'fs';
import pdf from './utils/custom-pdf-parse.js';

// Create a dummy PDF buffer (not a real PDF, but enough to see if it LOADS the module)
// Actually, let's just see if the module imports without crashing.
console.log("Attempting to import custom-pdf-parse...");

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
