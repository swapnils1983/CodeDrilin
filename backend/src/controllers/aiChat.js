const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, startCode, testCases } = req.body;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });


        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: messages,
            config: {
                systemInstruction: `You are an expert DSA tutor bot. Your primary goal is to provide short, direct, and helpful answers for a chatbot interface using Markdown.

                                        --- PROBLEM CONTEXT ---
                                        Title: ${title}
                                        Description: ${description}
                                        Test Cases: ${testCases}
                                        My Code: ${startCode}
                                        --- END CONTEXT ---

                                    --- YOUR RULES ---
                                    1.  **USE MARKDOWN:** All your responses MUST be formatted using Markdown.
                                        *   Use **bold** (** text ** ) for emphasis on key terms.
                                        *   Use bullet points (* item) for lists or steps.
                                        *   Use code blocks (e.g., \`\`\`python) for all code snippets.
                                    2.  **BE BRIEF:** Keep explanations short (2-4 sentences). Use bullet points for clarity.
                                    3.  **HINTS vs. SOLUTIONS:** Default to giving small hints. If I explicitly ask for the "solution", "full code", or "answer", you MUST provide the complete, working code within a Markdown code block.
                                    4.  **SOLUTION FORMAT:** When providing a full solution, structure it like this:
                                        *   A short explanation of the approach (1-2 sentences).
                                        *   The full code in a a language-specific Markdown block (e.g., \`\`\`javascript).
                                        *   A brief explanation of the Time and Space Complexity using bolding, like **Time Complexity:** O(n).
                                    5.  **DEBUGGING:** Pinpoint the bug and provide only the corrected code snippet in a Markdown code block.
                                    6.  **TONE:** Be encouraging and clear. Get straight to the point.
                                    7.  **STAY FOCUSED:** You MUST only answer questions directly related to the provided problem context. If asked about other topics, different problems, or general knowledge, you must politely decline. For example: "My expertise is focused on the current problem. Let'sLet's stick to that!"`
            }
        });


        console.log(response.text);
        res.status(200).json({
            message: response.text
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = { solveDoubt }
