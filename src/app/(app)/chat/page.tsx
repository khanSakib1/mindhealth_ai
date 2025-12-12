"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { getInitialMessage, sendMessage as sendChatMessage } from "./actions";
import type { ChatMessage } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ChatSkeleton() {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex-grow border rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-12 w-64" />
                </div>
                <div className="flex items-start justify-end gap-4">
                    <Skeleton className="h-12 w-56" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                 <div className="flex items-start gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-16 w-72" />
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[] | null>(null);

    useEffect(() => {
        getInitialMessage().then(initialMsg => {
            setMessages([initialMsg]);
        });
    }, []);

    const handleSendMessage = async (message: string): Promise<ChatMessage> => {
        const userMessage: ChatMessage = { role: 'user', content: message };
        setMessages((prev) => [...(prev || []), userMessage]);
        
        const aiResponse = await sendChatMessage(message, [...(messages || []), userMessage]);
        return aiResponse;
    }

    if (!messages) {
        return <ChatSkeleton />;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
                <p className="text-muted-foreground">Your confidential space to talk and reflect.</p>
            </div>
            <div className="flex-grow">
                <ChatInterface 
                    messages={messages} 
                    setMessages={setMessages}
                    sendMessage={handleSendMessage} 
                />
            </div>
        </div>
    );
}
