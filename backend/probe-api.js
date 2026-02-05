import axios from 'axios';

const BASE_URL = 'https://ai-learn-6cdc.vercel.app';

async function probe() {
    console.log(`Probing: ${BASE_URL}/api/documents`);
    try {
        await axios.get(`${BASE_URL}/api/documents`);
        console.log("✅ Success (Unexpected? Should be 401)");
    } catch (error) {
        if (error.response) {
            console.log(`❌ Status: ${error.response.status}`);
            console.log(`   Type: ${error.response.headers['content-type']}`);
            console.log(`   Data:`, JSON.stringify(error.response.data).substring(0, 200));
        } else {
            console.log("❌ Network Error:", error.message);
        }
    }
}

probe();
