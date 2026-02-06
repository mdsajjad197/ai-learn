import pdf from './utils/custom-pdf-parse.js';

console.log("Attempting to import via custom-pdf-parse.js (redirect)...");

async function test() {
    try {
        if (pdf && typeof pdf === 'function') {
            console.log("✅ Success: custom-pdf-parse.js correctly exports the parser function.");
        } else {
            console.error("❌ Failure: custom-pdf-parse.js did not export a function.", pdf);
        }
    } catch (error) {
        console.error("❌ Error during import/execution:", error);
    }
}

test();
