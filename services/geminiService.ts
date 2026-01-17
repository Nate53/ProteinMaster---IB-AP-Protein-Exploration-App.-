import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestions = async (topic: string, difficulty: 'IB' | 'AP'): Promise<QuizQuestion[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini. Returning mock data.");
    return getMockQuestions(topic);
  }

  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Create 3 multiple-choice questions for ${difficulty} Biology students about the topic: "${topic}" related to Proteins.
    The questions should test deep understanding, not just memorization.
    Return strictly JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockQuestions(topic);
  }
};

export const getTutorExplanation = async (question: string): Promise<string> => {
    if (!apiKey) return "I need an API key to function as your tutor! Please check the configuration.";

    const modelId = "gemini-2.5-flash";
    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `You are an expert IB/AP Biology teacher. Answer this student's question about proteins clearly and concisely (max 3 sentences): "${question}"`,
        });
        return response.text || "I couldn't generate an answer at this time.";
    } catch (e) {
        console.error(e);
        return "Sorry, I'm having trouble connecting to the biology database right now.";
    }
}

// Fallback if API fails or key is missing
const getMockQuestions = (topic: string): QuizQuestion[] => [
  {
    question: "Which bond is formed between two amino acids during translation?",
    options: ["Ionic bond", "Peptide bond", "Hydrogen bond", "Disulfide bridge"],
    correctAnswer: 1,
    explanation: "A peptide bond is a covalent chemical bond linking two consecutive amino acid monomers along a peptide or protein chain."
  },
  {
    question: "What determines the primary structure of a protein?",
    options: ["Hydrogen bonding", "The sequence of amino acids", "Interaction between R groups", "The pH of the environment"],
    correctAnswer: 1,
    explanation: "The primary structure is simply the sequence of amino acids in the polypeptide chain, determined by the gene."
  },
  {
    question: "Denaturation implies the loss of which structures?",
    options: ["Primary only", "Secondary and Tertiary", "Primary and Secondary", "All structures"],
    correctAnswer: 1,
    explanation: "Denaturation disrupts the secondary and tertiary structures (shape) but typically leaves the primary structure (peptide bonds) intact."
  }
];