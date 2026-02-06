import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export default async function parsePDF(dataBuffer) {
    try {
        // Load the document
        // We pass the data as a Uint8Array
        const uint8Array = new Uint8Array(dataBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
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
