import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { DUDE_SYSTEM_INSTRUCTION, MODEL_NAME } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

// Initialize the API client
const getClient = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

// Initialize or retrieve the chat session
const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = getClient();
    chatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: DUDE_SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

/**
 * Sends a message to the "Dude" bot and streams the response.
 * @param message The user's message.
 * @param onChunk Callback for each chunk of text received.
 * @returns The full response text.
 */
export const sendMessageToDude = async (
  message: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const chat = getChatSession();
    const resultStream = await chat.sendMessageStream({ message });
    
    let fullText = "";

    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullText += text;
        onChunk(fullText); // Update UI with accumulated text
      }
    }

    return fullText;
  } catch (error) {
    console.error("Error talking to Dude:", error);
    throw error;
  }
};

export const resetConversation = () => {
  chatSession = null;
};