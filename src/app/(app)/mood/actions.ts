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
  // Mock for guest user
  if (userId === 'guest-user') {
    const today = new Date();
    const mockLogs: MoodLog[] = [
      { id: '1', mood: 'good', date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], userId: 'guest-user', createdAt: new Date() as any },
      { id: '2', mood: 'neutral', date: new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0], notes: 'A bit tired', userId: 'guest-user', createdAt: new Date() as any },
      { id: '3', mood: 'great', date: new Date(today.setDate(today.getDate() - 4)).toISOString().split('T')[0], userId: 'guest-user', createdAt: new Date() as any },
    ];
    return Promise.resolve(mockLogs);
  }

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
      date: data.date, // Already in YYYY-MM-DD
    } as MoodLog;
  });
}

export async function addMoodLog(userId: string, values: z.infer<typeof formSchema>) {
    if (userId === 'guest-user') {
      // Prevent adding logs for guest user in this mock setup
      console.log("Guest user tried to add a mood log.");
      return;
    }
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
