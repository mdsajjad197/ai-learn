import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Explicitly set workerSrc to avoid "worker module not found" errors
// For legacy build in Node, we can point to the same file or null if worker is disabled
// But modern pdfjs-dist often requires it.
// We'll trust the legacy build's ability to run without a separate worker file if configured right, 
// OR we point to the installed worker.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

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
