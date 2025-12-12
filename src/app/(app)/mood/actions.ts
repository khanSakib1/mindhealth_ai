'use server';

import type { MoodLog } from "@/lib/definitions";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { z } from "zod";
import { analyzeMoodPatterns } from "@/ai/flows/analyze-mood-patterns";

const formSchema = z.object({
  mood: z.enum(["great", "good", "neutral", "bad", "awful"]),
  notes: z.string().max(500).optional(),
});

export async function getMoodLogs(userId: string): Promise<MoodLog[]> {
  const q = query(
    collection(db, "mood_logs"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: new Date(data.date).toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
    } as MoodLog;
  });
}

export async function addMoodLog(userId: string, values: z.infer<typeof formSchema>) {
    const today = new Date().toISOString().split('T')[0];

    await addDoc(collection(db, "mood_logs"), {
      ...values,
      userId: userId,
      date: today,
      createdAt: serverTimestamp(),
    });
}

export async function analyzePatterns(userId: string, moodLogs: MoodLog[]): Promise<string> {
    if (moodLogs.length < 3) {
        return "Not enough data to analyze patterns. Keep logging your mood for a few more days!";
    }
    const result = await analyzeMoodPatterns({
        userId,
        moodLogs: moodLogs.map(log => ({
            date: log.date,
            mood: log.mood,
            notes: log.notes
        }))
    });
    return result.analysis;
}
