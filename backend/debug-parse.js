import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import parsePDF from './utils/pdfParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testParse() {
    try {
        const filePath = path.join(__dirname, 'valid_sample.pdf');

        // Ensure file exists
        if (!fs.existsSync(filePath)) {
            console.log("Downloading sample PDF...");
            // Valid PDF
            const pdfRes = await fetch('https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/tracemonkey.pdf');
            const buffer = await pdfRes.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));
        }

        const buffer = fs.readFileSync(filePath);
        console.log("Parsing PDF...");
        const data = await parsePDF(buffer);
        console.log("Success!");
        console.log("Text length:", data.text.length);
        console.log("Preview:", data.text.substring(0, 100));

    } catch (error) {
        console.error("Parse Failed:", error);
    }
}

testParse();
