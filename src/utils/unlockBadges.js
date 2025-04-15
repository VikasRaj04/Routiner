import {
    collection,
    getDocs,
    setDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const unlockBadges = async ({
    userId,
    userHabits = [],
    todayCompletedHabits = [],
    todayAllHabits = [],
    currentHour = new Date().getHours(), // pass in case you want to mock test it
}) => {
    if (!userId) return;

    const userBadgeRef = collection(db, "users", userId, "badges");
    const snapshot = await getDocs(userBadgeRef);
    const unlockedBadgeIds = snapshot.docs.map((doc) => doc.id);

    const newBadges = [];

    // --- 🏁 Onboarding ---
    if (!unlockedBadgeIds.includes("starter") && userHabits.length >= 1) {
        newBadges.push({
            id: "starter",
            name: "🆕 Starter",
            description: "Created your first habit.",
            type: "onboarding",
        });
    }

    const hasCompletedAnyHabit = userHabits.some(
        (habit) => habit.totalCompletions >= 1
    );
    if (!unlockedBadgeIds.includes("firstComplete") && hasCompletedAnyHabit) {
        newBadges.push({
            id: "firstComplete",
            name: "✅ First Complete",
            description: "Marked your first habit as done.",
            type: "onboarding",
        });
    }

    // --- 🔥 Daily --- "🌟 Perfect Day",
    // 🌟 Perfect Day Badge: All habits fully completed
const allHabitsFullyDone = todayAllHabits.every(habit => {
    const completed = todayCompletedHabits.find(h => h.id === habit.id);
    return (
      completed &&
      (completed.completedToday || 0) >= (habit.frequencyPerDay || 1)
    );
  });
  
  if (!unlockedBadgeIds.includes("perfectDay") && allHabitsFullyDone) {
    newBadges.push({
      id: "perfectDay",
      name: "🌟 Perfect Day",
      description: "Completed all habits for the day.",
      type: "daily",
    });
  }
  
  // ⚡ Early Bird Badge: All habits fully completed AND before 9 AM
  const isEarlyBird =
    allHabitsFullyDone &&
    todayCompletedHabits.every(habit => habit.completedHour <= 9);
  
  if (!unlockedBadgeIds.includes("earlyBird") && isEarlyBird) {
    newBadges.push({
      id: "earlyBird",
      name: "⚡ Early Bird",
      description: "Completed all habits before 9 AM.",
      type: "daily",
    });
  }
  
    // "📅 Consistent Day",
    const fullyCompletedCount = todayAllHabits.reduce((count, habit) => {
        const completed = todayCompletedHabits.find(h => h.id === habit.id);
        if (
            completed &&
            (completed.completedToday || 0) >= (habit.frequencyPerDay || 1)
        ) {
            return count + 1;
        }
        return count;
    }, 0);

    const totalHabits = todayAllHabits.length;

    const percentage =
        totalHabits > 0 ? (fullyCompletedCount / totalHabits) * 100 : 0;

    if (!unlockedBadgeIds.includes("consistentDay") && percentage >= 80) {
        newBadges.push({
            id: "consistentDay",
            name: "📅 Consistent Day",
            description: "Completed at least 80% habits in a day.",
            type: "daily",
        });
    }



    // --- 🧮 Completion-Based ---
    const maxCompletion = Math.max(
        ...userHabits.map((habit) => habit.totalCompletions || 0),
        0
    );

    if (!unlockedBadgeIds.includes("initiator") && maxCompletion >= 10) {
        newBadges.push({
            id: "initiator",
            name: "🥉 Initiator",
            description: "Completed any habit 10 times.",
            type: "completion",
        });
    }
    if (!unlockedBadgeIds.includes("progressor") && maxCompletion >= 50) {
        newBadges.push({
            id: "progressor",
            name: "🥈 Progressor",
            description: "Completed any habit 50 times.",
            type: "completion",
        });
    }
    if (!unlockedBadgeIds.includes("performer") && maxCompletion >= 100) {
        newBadges.push({
            id: "performer",
            name: "🥇 Performer",
            description: "Completed any habit 100 times.",
            type: "completion",
        });
    }
    if (!unlockedBadgeIds.includes("dailyDevotee") && maxCompletion >= 365) {
        newBadges.push({
            id: "dailyDevotee",
            name: "🧘 Daily Devotee",
            description: "Completed any habit 365 times.",
            type: "completion",
        });
    }

    // 🔥 Save to Firebase
    for (const badge of newBadges) {
        const badgeDoc = doc(db, "users", userId, "badges", badge.id);
        await setDoc(badgeDoc, {
            name: badge.name,
            description: badge.description,
            type: badge.type,
            unlockedAt: serverTimestamp(),
        });
    }

    return newBadges;
};
