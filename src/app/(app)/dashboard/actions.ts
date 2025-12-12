'use server';

import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import type { JournalEntry, MoodLog } from "@/lib/definitions";
import { generatePersonalizedWellnessTips } from "@/ai/flows/generate-personalized-wellness-tips";

async function getRecentJournalEntries(userId: string, count: number): Promise<JournalEntry[]> {
  const q = query(
    collection(db, "journal_entries"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(count)
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
    } as JournalEntry;
  });
}

async function getRecentMoodLogs(userId: string, count: number): Promise<MoodLog[]> {
  const q = query(
    collection(db, "mood_logs"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date,
    } as MoodLog;
  });
}

export type DashboardData = {
  recentEntry: JournalEntry | null;
  recentMood: MoodLog | null;
  wellnessTip: string;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
    const [journalEntries, moodLogs] = await Promise.all([
        getRecentJournalEntries(userId, 1),
        getRecentMoodLogs(userId, 1)
    ]);

    const recentEntry = journalEntries.length > 0 ? journalEntries[0] : null;
    const recentMood = moodLogs.length > 0 ? moodLogs[0] : null;

    let wellnessTip = "Start by writing a journal entry or logging your mood to get personalized tips.";

    if (recentEntry) {
        const allMoods = await getRecentMoodLogs(userId, 7);
        const moodDataString = allMoods.length > 0 
            ? allMoods.map(log => `On ${log.date}, mood was ${log.mood}`).join('. ')
            : "No recent mood data available.";
        
        try {
            const result = await generatePersonalizedWellnessTips({
                journalEntry: recentEntry.content,
                moodData: moodDataString,
            });
            wellnessTip = result.wellnessTips;
        } catch (error) {
            console.error("Dashboard: Failed to get wellness tip", error);
            wellnessTip = "Could not generate a wellness tip at this time. Please try again later.";
        }
    }

    return {
        recentEntry,
        recentMood,
        wellnessTip
    };
}
