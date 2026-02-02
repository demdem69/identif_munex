import { GoogleGenAI, Type } from "@google/genai";

// FIX: Always use a named parameter and exclusively from process.env.API_KEY for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askEODExpert(query: string, contextItem?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // FIX: Use systemInstruction in the config instead of putting persona in contents
      contents: `Question : ${query}`,
      config: {
        systemInstruction: `Tu es un assistant expert EOD (Explosive Ordnance Disposal). 
                 Contexte : ${contextItem ? `Munition spécifique : ${contextItem}` : "Manuel de terrain général"}. 
                 Fournis une réponse professionnelle, technique mais claire, centrée sur l'identification et la sécurité. Réponds toujours en français.`,
      }
    });
    // FIX: Access the .text property directly (not a method) as per SDK rules
    return response.text || "Désolé, la radio est inaudible. Veuillez répéter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "La radio de terrain est actuellement brouillée. Veuillez réessayer plus tard.";
  }
}

export async function generateQuizQuestion(categories: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Génère une question de quiz difficile sur les munitions explosives dans les catégories : ${categories.join(', ')}.`,
      config: {
        // FIX: Moved persona and format instructions to systemInstruction
        systemInstruction: "Tu es un générateur de quiz EOD professionnel. Réponds en français et au format JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"],
          propertyOrdering: ["question", "options", "correctAnswerIndex", "explanation"],
        }
      }
    });
    // FIX: Access .text directly and handle potential undefined before parsing JSON
    const jsonStr = response.text?.trim();
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return null;
  }
}