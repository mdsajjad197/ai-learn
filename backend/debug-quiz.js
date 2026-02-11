import { generateQuiz } from './services/aiService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testQuiz() {
    console.log("Testing AI Quiz Generation...");
    const sampleText = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the aid of chlorophyll. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct.";

    try {
        const quiz = await generateQuiz(sampleText, "Photosynthesis");
        console.log("Quiz Generated Successfully:");
        console.log(JSON.stringify(quiz, null, 2));
    } catch (error) {
        console.error("Quiz Generation Failed:", error);
    }
}

testQuiz();
