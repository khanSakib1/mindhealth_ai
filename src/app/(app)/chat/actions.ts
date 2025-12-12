'use server';

import { mentalWellnessConversation } from "@/ai/flows/provide-mental-wellness-conversation";
import type { ChatMessage } from "@/lib/definitions";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
    const chatRef = doc(db, "chat_history", userId);
    const chatSnap = await getDoc(chatRef);
  
    if (chatSnap.exists()) {
      return chatSnap.data().messages;
    }
    
    return [];
}

export async function sendMessage(userId: string, message: string): Promise<ChatMessage> {
    const userMessage: ChatMessage = { role: 'user', content: message };
    
    const res = await mentalWellnessConversation({ message });
    const aiMessage: ChatMessage = { role: 'assistant', content: res.response };

    const chatRef = doc(db, "chat_history", userId);
    const chatSnap = await getDoc(chatRef);

    if (chatSnap.exists()) {
        await updateDoc(chatRef, {
            messages: arrayUnion(userMessage, aiMessage)
        });
    } else {
        await setDoc(chatRef, {
            userId: userId,
            messages: [userMessage, aiMessage]
        });
    }
    
    return aiMessage;
}
