import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
const filePath = path.join(uploadsDir, 'test.pdf');

console.log(`Checking file: ${filePath}`);

(async () => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error('File does not exist!');
            process.exit(1);
        }

        const buffer = fs.readFileSync(filePath);
        console.log(`Read success! Length: ${buffer.length}`);

        console.log('Parsing PDF...');
        const data = await pdf(buffer);
        console.log('Success!');
        console.log('Text content:', data.text.trim());

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    }
})();
