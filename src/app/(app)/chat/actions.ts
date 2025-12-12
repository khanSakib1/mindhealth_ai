
'use server';

import { mentalWellnessConversation } from "@/ai/flows/provide-mental-wellness-conversation";
import type { ChatMessage } from "@/lib/definitions";


export async function getInitialMessage(): Promise<ChatMessage> {
    return Promise.resolve({
        role: 'assistant',
        content: "Hello! I'm your AI wellness companion. How are you feeling today? Feel free to share anything on your mind."
    });
}

export async function sendMessage(message: string, history: ChatMessage[]): Promise<ChatMessage> {
    // The AI flow expects a history of objects with { role, content }.
    // The full history including the new message is passed here.
    const res = await mentalWellnessConversation({ 
        message: message, 
        history: history 
    });

    const aiMessage: ChatMessage = { role: 'assistant', content: res.response };
    return aiMessage;
}
