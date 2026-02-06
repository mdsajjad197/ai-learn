import axios from 'axios';
import pdf from './utils/pdfParser.js';

const CHECK_URL = "https://res.cloudinary.com/dgznhwchw/image/upload/v1770320645/antigravity-docs/doyuowq0qixpr9lsljex.pdf";

async function testRemotePdf() {
    console.log(`Testing access to: ${CHECK_URL}`);
    try {
        const response = await axios.get(CHECK_URL, {
            responseType: 'arraybuffer',
            validateStatus: false // Don't throw on 404/401 yet
        });

        console.log(`Status Code: ${response.status}`);
        console.log(`Content Type: ${response.headers['content-type']}`);
        console.log(`Data Length: ${response.data.length}`);

        if (response.status !== 200) {
            console.error("❌ Download failed (non-200 status)");
            return;
        }

        if (response.headers['content-type'].includes('text/html')) {
            console.error("❌ Downloaded HTML instead of PDF (likely error page)");
            return;
        }

        console.log("✅ Download successful. Attempting parse...");
        const dataBuffer = Buffer.from(response.data);
        const data = await pdf(dataBuffer);

        console.log("✅ Parse successful!");
        console.log("Text Preview:", data.text.substring(0, 100));

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testRemotePdf();
