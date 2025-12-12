'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, updateDoc, limit } from "firebase/firestore";
import type { JournalEntry, MoodLog } from "@/lib/definitions";
import { summarizeJournalEntries } from "@/ai/flows/summarize-journal-entries";
import { detectSentimentInJournalEntries } from "@/ai/flows/detect-sentiment-in-journal-entries";
import { generatePersonalizedWellnessTips } from "@/ai/flows/generate-personalized-wellness-tips";
import { z } from "zod";

const journalSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(5000),
});

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const q = query(
    collection(db, "journal_entries"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      date: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      userId: data.userId,
      sentiment: data.sentiment,
    } as JournalEntry;
  });
}

export async function addEntry(userId: string, values: z.infer<typeof journalSchema>): Promise<void> {
    await addDoc(collection(db, "journal_entries"), {
      userId: userId,
      title: values.title,
      content: values.content,
      createdAt: serverTimestamp(),
    });
}

export async function summarizeEntry(entryId: string, content: string): Promise<string> {
    const result = await summarizeJournalEntries({ journalEntries: content });
    return result.summary;
}

export async function analyzeSentiment(entryId: string, content: string): Promise<{ sentiment: string; score: number }> {
    const result = await detectSentimentInJournalEntries({ journalEntry: content });
    const entryRef = doc(db, "journal_entries", entryId);
    await updateDoc(entryRef, { sentiment: result });
    return result;
}

export async function getWellnessTips(userId: string, journalContent: string): Promise<string> {
    const moodQuery = query(
        collection(db, "mood_logs"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(7)
    );
    const moodSnapshot = await getDocs(moodQuery);
    const moodLogs: MoodLog[] = moodSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        mood: data.mood,
        notes: data.notes,
        date: data.date,
        userId: data.userId,
        createdAt: data.createdAt,
      }
    });
    
    const moodDataString = moodLogs.length > 0 
        ? moodLogs.map(log => `On ${log.date}, mood was ${log.mood}${log.notes ? ` (Notes: ${log.notes})` : ''}`).join('. ')
        : "No recent mood data available.";

    const result = await generatePersonalizedWellnessTips({
        journalEntry: journalContent,
        moodData: moodDataString,
    });
    return result.wellnessTips;
}
