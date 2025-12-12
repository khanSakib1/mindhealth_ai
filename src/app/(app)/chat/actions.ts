
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
    const res = await mentalWellnessConversation({ message, history });
    const aiMessage: ChatMessage = { role: 'assistant', content: res.response };
    return aiMessage;
}
