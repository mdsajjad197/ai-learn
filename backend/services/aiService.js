import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env vars are loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

let openai;
const MODEL_NAME = "google/gemini-2.0-flash-001"; // Free tier model

const initializeAI = () => {
    if (openai) return;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ OPENROUTER_API_KEY is missing in .env");
        return;
    }

    openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "EduCompanion",
        }
    });
    console.log("✅ AI Service Initialized (OpenRouter)");
};

// Auto-init
initializeAI();

export const generateChatResponse = async (context, query) => {
    if (!openai) initializeAI();
    if (!openai) return "AI Service Unavailable: API Key missing in backend .env file.";

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful study assistant. Use the provided context to answer questions.\n\nContext:\n${context.substring(0, 15000)}`
                },
                {
                    role: "user",
                    content: query
                }
            ],
        });

        return completion.choices[0].message.content || "No response generated.";
    } catch (error) {
        console.error("OpenRouter Chat Error:", error);
        if (error.status === 401) {
            return "❌ **Auth Error**: The OpenRouter API Key is invalid or disabled. Please check the backend .env file.";
        }
        if (error.status === 402 || error.status === 429) {
            return "⚠️ **Quota Exceeded**: OpenRouter free credits exhausted or model busy.";
        }
        return `Error: ${error.message}`;
    }
};

export const generateFlashcards = async (context, topic) => {
    if (!openai) initializeAI();
    if (!openai) throw new Error("AI Service Unavailable");

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content: "You are a JSON generator."
                },
                {
                    role: "user",
                    content: `Create 5 study flashcards based on the text below. Topic: ${topic}.
                    Return valid JSON Array: [{"front": "Question", "back": "Answer"}].
                    No markdown.
                    
                    Text: ${context.substring(0, 10000)}`
                }
            ],
        });

        let text = completion.choices[0].message.content;
        // Clean markdown
        text = text.replace(/```json|```/g, '').trim();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", text);
            return []; // Fail gracefully
        }

    } catch (error) {
        console.error("OpenRouter Flashcard Error:", error);
        throw new Error("Failed to generate flashcards");
    }
};

export const generateQuiz = async (context, topic) => {
    if (!openai) initializeAI();
    if (!openai) throw new Error("AI Service Unavailable");

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content: "You are a JSON generator."
                },
                {
                    role: "user",
                    content: `Create a multiple-choice quiz (3 questions) based on the text. Topic: ${topic}.
                    Return valid JSON Array: [{"id": 1, "question": "...", "options": ["A","B","C","D"], "answer": "Option Text", "explanation": "Brief explanation of why this is the correct answer."}].
                    No markdown.
                    
                    Text: ${context.substring(0, 10000)}`
                }
            ],
        });

        let text = completion.choices[0].message.content;

        // Robust JSON extraction
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');

        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        } else {
            // Fallback cleanup if exact array markers aren't found
            text = text.replace(/```json|```/g, '').trim();
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error. Raw text:", completion.choices[0].message.content);
            console.error("Extracted text:", text);
            return [];
        }

    } catch (error) {
        console.error("OpenRouter Quiz Error:", error);
        throw new Error("Failed to generate quiz");
    }
};

export const generateRevisionPlan = async (context) => {
    if (!openai) initializeAI();
    if (!openai) throw new Error("AI Service Unavailable");

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                {
                    role: "system",
                    content: "You are a study planner."
                },
                {
                    role: "user",
                    content: `Create a concise revision plan based on these topics: ${context}.
                    Return valid JSON Array: [{"day": "Day 1", "tasks": ["Task 1", "Task 2"], "focus": "Main Focus"}].
                    Plan should covers 3-5 days.
                    No markdown.`
                }
            ],
        });

        let text = completion.choices[0].message.content;
        text = text.replace(/```json|```/g, '').trim();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error (Revision Plan):", text);
            return [];
        }

    } catch (error) {
        console.error("OpenRouter Revision Plan Error:", error);
        throw new Error("Failed to generate revision plan");
    }
};
