import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const listModels = async () => {
    try {
        console.log("Fetching OpenRouter models...");
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();

        if (data.data) {
            console.log("Found models:");
            const geminiModels = data.data.filter(m => m.id.includes("gemini") || m.id.includes("flash"));
            geminiModels.forEach(m => console.log(`- ${m.id} (${m.pricing.prompt === '0' ? 'Likely Free' : 'Paid'})`));
        } else {
            console.log("No data found", data);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

listModels();
