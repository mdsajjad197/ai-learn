import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const listModels = async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
    });

    try {
        const models = await openai.models.list();
        const geminiModels = models.data.filter(m => m.id.includes("gemini"));
        console.log("Found Gemini Models:");
        geminiModels.forEach(m => console.log(m.id));
    } catch (error) {
        console.error("Error listing models:", error);
    }
};

listModels();
