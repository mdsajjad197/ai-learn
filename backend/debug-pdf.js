import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'uploads', 'file-1770115993580.pdf');
const logPath = path.join(__dirname, 'debug-log.txt');

console.log(`Attempting to read file: ${filePath}`);

async function run() {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist!');
        }

        const dataBuffer = fs.readFileSync(filePath);
        console.log(`File read, size: ${dataBuffer.length}`);

        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();

        console.log('Success!');
        console.log('Text length:', data.text.length);
        fs.writeFileSync(logPath, 'Success!\n' + data.text.substring(0, 100));
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        fs.writeFileSync(logPath, `Error parsing PDF:\n${error.message}\n${error.stack}`);
    }
}

run();
