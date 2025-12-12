
'use server';

import { mentalWellnessConversation } from "@/ai/flows/provide-mental-wellness-conversation";
import type { ChatMessage } from "@/lib/definitions";

// Since we have no persistent database, we'll store messages in memory for the session.
const chatHistory: ChatMessage[] = [];

export async function getChatHistory(): Promise<ChatMessage[]> {
    // Return a copy of the in-memory chat history
    return Promise.resolve([...chatHistory]);
}

export async function sendMessage(message: string): Promise<ChatMessage> {
    const userMessage: ChatMessage = { role: 'user', content: message };
    chatHistory.push(userMessage);
    
    const res = await mentalWellnessConversation({ message });
    const aiMessage: ChatMessage = { role: 'assistant', content: res.response };
    chatHistory.push(aiMessage);
    
    return aiMessage;
}
