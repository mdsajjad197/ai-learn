import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const checkOpenRouter = async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    console.log("-------------------------------------------------");
    console.log("Checking OpenRouter Configuration...");

    if (!apiKey) {
        console.error("❌ ERROR: No OPENROUTER_API_KEY found in .env file.");
        return;
    }

    console.log(`🔑 Key found: ${apiKey.substring(0, 8)}...`);
    console.log("📡 Testing connection to OpenRouter...");

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: [
                { role: "user", content: "Say 'OpenRouter is working!'" }
            ],
        });

        console.log("-------------------------------------------------");
        console.log("✅ SUCCESS! OpenRouter is connected.");
        console.log(`🤖 Response: "${completion.choices[0].message.content}"`);
        console.log("-------------------------------------------------");
    } catch (error) {
        console.log("-------------------------------------------------");
        console.error("❌ FAILED: OpenRouter Error.");
        console.error(`Status: ${error.status}`);
        console.error(`Message: ${error.message}`);
        console.log("-------------------------------------------------");
    }
};

checkOpenRouter();
