import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import { createRequire } from 'module';
import { pathToFileURL } from 'url';

const require = createRequire(import.meta.url);

// Explicitly resolve the absolute path to the worker to ensure it works regardless of CWD
try {
    const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
    // On Windows/ESM, pdfjs-dist requires a file:// URL
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
} catch (e) {
    // Fallback or log if resolution fails (unlikely if package is installed)
    console.warn("Could not resolve specific pdf.worker.mjs path, falling back to string:", e);
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';
}

export default async function parsePDF(dataBuffer) {
    try {
        // Load the document
        // We pass the data as a Uint8Array
        const uint8Array = new Uint8Array(dataBuffer);
        const loadingTask = pdfjsLib.getDocument({
            data: uint8Array,
            // Disable worker if possible for simpler Node usage? 
            // pdfjs-dist 4+ is strict. 
            // Setting verbosity to 0 to suppress some warnings
            verbosity: 0
        });
        const doc = await loadingTask.promise;

        let fullText = '';

        // Iterate through pages
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();

            // Extract text items
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            fullText += pageText + '\n\n';
        }

        return {
            text: fullText,
            numpages: doc.numPages,
            info: null,
            metadata: null
        };
    } catch (error) {
        console.error("PDFJS-DIST Parsing Error:", error);
        throw new Error("Failed to parse PDF: " + error.message);
    }
}
