const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/explain', async (req, res) => {
    const { topic, operation, language } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are a strict Data Structures and Algorithms API.
            Topic: ${topic}
            Operation: ${operation}
            Language: ${language || 'Pseudocode'}

            Return a RAW JSON object (no markdown formatting, no backticks) with exactly these fields:
            {
                "title": "Short Title (e.g. Insertion at Head)",
                "desc": "A 2-sentence explanation of what happens logically.",
                "code": "The code/pseudocode implementation.",
                "complexity": "Time: O(x) | Space: O(y)"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up if Gemini accidentally adds markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(cleanText));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));