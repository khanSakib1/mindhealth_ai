import type { Timestamp } from "firebase/firestore";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  userId: string;
  sentiment?: {
    sentiment: string;
    score: number;
  }
};

export type Mood = "awful" | "bad" | "neutral" | "good" | "great";

export type MoodLog = {
  id: string;
  mood: Mood;
  notes?: string;
  date: string; // YYYY-MM-DD
  userId: string;
  createdAt: Timestamp;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
