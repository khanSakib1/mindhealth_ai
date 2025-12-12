"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { getChatHistory, sendMessage as sendChatMessage } from "./actions";
import type { ChatMessage } from "@/lib/definitions";
import { useAuth } from "@/providers/auth-provider";
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
    const { user } = useAuth();
    const [initialMessages, setInitialMessages] = useState<ChatMessage[] | null>(null);

    useEffect(() => {
        if (user) {
            getChatHistory(user.uid).then(history => {
                if (history.length === 0) {
                    setInitialMessages([{
                        role: 'assistant',
                        content: "Hello! I'm your AI wellness companion. How are you feeling today? Feel free to share anything on your mind."
                    }]);
                } else {
                    setInitialMessages(history);
                }
            });
        }
    }, [user]);

    async function handleSendMessage(message: string): Promise<ChatMessage> {
        if (!user) throw new Error("User not authenticated.");
        return sendChatMessage(user.uid, message);
    }

    if (!user || !initialMessages) {
        return <ChatSkeleton />;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
                <p className="text-muted-foreground">Your confidential space to talk and reflect.</p>
            </div>
            <div className="flex-grow">
                <ChatInterface initialMessages={initialMessages} sendMessage={handleSendMessage} />
            </div>
        </div>
    );
}
