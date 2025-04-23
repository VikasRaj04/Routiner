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

    // --- 🔥 Daily Performance ---
    const allHabitsFullyDone = todayAllHabits.every(habit => {
        const completed = todayCompletedHabits.find(h => h.id === habit.id);
        return completed && (completed.completedToday || 0) >= (habit.frequencyPerDay || 1);
    });

    if (!unlockedBadgeIds.includes("perfectDay") && allHabitsFullyDone) {
        newBadges.push({
            id: "perfectDay",
            name: "🌟 Perfect Day",
            description: "Completed all habits for the day.",
            type: "daily",
        });
    }

    const isEarlyBird = allHabitsFullyDone &&
        todayCompletedHabits.every(habit => habit.completedHour <= 9);

    if (!unlockedBadgeIds.includes("earlyBird") && isEarlyBird) {
        newBadges.push({
            id: "earlyBird",
            name: "⚡ Early Bird",
            description: "Completed all habits before 9 AM.",
            type: "daily",
        });
    }

    const fullyCompletedCount = todayAllHabits.reduce((count, habit) => {
        const completed = todayCompletedHabits.find(h => h.id === habit.id);
        if (completed && (completed.completedToday || 0) >= (habit.frequencyPerDay || 1)) {
            return count + 1;
        }
        return count;
    }, 0);

    const percentage = (todayAllHabits.length > 0) ?
        (fullyCompletedCount / todayAllHabits.length) * 100 : 0;

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

    const completionBadges = [
        { id: "initiator", threshold: 10, name: "🥉 Initiator", description: "Completed any habit 10 times." },
        { id: "progressor", threshold: 50, name: "🥈 Progressor", description: "Completed any habit 50 times." },
        { id: "performer", threshold: 100, name: "🥇 Performer", description: "Completed any habit 100 times." },
        { id: "dailyDevotee", threshold: 365, name: "🧘 Daily Devotee", description: "Completed any habit 365 times." }
    ];

    completionBadges.forEach(({ id, threshold, name, description }) => {
        if (!unlockedBadgeIds.includes(id) && maxCompletion >= threshold) {
            newBadges.push({
                id,
                name,
                description,
                type: "completion",
            });
        }
    });

    // 🔥 Save to Firebase
    const badgePromises = newBadges.map((badge) => {
        const badgeDoc = doc(db, "users", userId, "badges", badge.id);
        return setDoc(badgeDoc, {
            name: badge.name,
            description: badge.description,
            type: badge.type,
            unlockedAt: serverTimestamp(),
        });
    });

    await Promise.all(badgePromises);

    return newBadges;
};
