import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * 📝 Habit progress ko store/update karega Firebase me.
 * @param {string} userId - User ka unique ID (Firebase Auth se milega).
 * @param {string} habitId - Habit ka unique ID.
 * @param {string} date - YYYY-MM-DD format me date.
 * @param {number} index - Agar habit ek din me multiple baar complete hoti hai to index define karega.
 */
export const updateHabitProgress = async (userId, habitId, date, index) => {
    if (!userId) return; // Agar user logged in nahi hai toh kuch mat karo.

    const progressRef = doc(db, `users/${userId}/progress/${habitId}`);

    try {
        const progressSnap = await getDoc(progressRef);
        let progressData = progressSnap.exists() ? progressSnap.data() : {};

        if (!progressData[date]) {
            progressData[date] = [];
        }

        if (!progressData[date].includes(index)) {
            progressData[date].push(index);
        }

        await setDoc(progressRef, progressData);
    } catch (error) {
        console.error("❌ Error updating habit progress:", error);
    }
};

/**
 * 📊 Habit progress fetch karega Firebase se.
 * @param {string} userId - User ka unique ID.
 * @param {string} habitId - Habit ka unique ID.
 * @returns {Object} - Habit progress ka object.
 */
export const getHabitProgress = async (userId, habitId) => {
    if (!userId) return {};

    const progressRef = doc(db, `users/${userId}/progress/${habitId}`);

    try {
        const progressSnap = await getDoc(progressRef);
        return progressSnap.exists() ? progressSnap.data() : {};
    } catch (error) {
        console.error("❌ Error fetching habit progress:", error);
        return {};
    }
};

// utils/dailygraph formatting data
export const formatDailyGraphData = (progressData) => {
    const dateTotals = {};
    const today = new Date();
    const last10Dates = [];

    for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        last10Dates.push(dateStr);
        dateTotals[dateStr] = { completed: 0, total: 0 };
    }

    for (const habitId in progressData) {
        const completion = progressData[habitId].completion;
        if (!completion) continue;

        for (const date in completion) {
            if (!last10Dates.includes(date)) continue;

            const ticks = completion[date]?.ticks;
            if (!Array.isArray(ticks)) continue;

            const completed = ticks.filter(Boolean).length;
            const total = ticks.length;

            dateTotals[date].completed += completed;
            dateTotals[date].total += total;
        }
    }

    return last10Dates.map((date) => {
        const { completed, total } = dateTotals[date];
        const progress = total > 0 ? parseFloat(((completed / total) * 100).toFixed(1)) : 0;
        return { date, progress };
    });
};

// Weekly Graph
export const formatWeeklyGraphData = (progressData) => {
    if (!progressData || typeof progressData !== "object") {
        console.warn("No progress data provided or invalid format.");
        return [];
    }

    const dateTotals = {};
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)

    // STEP 1: Get Last Monday (1 week before current Monday)
    const lastMonday = new Date(today);
    const daysSinceMonday = (currentDay + 6) % 7; // e.g., Mon=1 → 0, Sun=0 → 6
    lastMonday.setDate(today.getDate() - daysSinceMonday - 7); // Go back 7 days from previous Monday

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6); // lastSunday = 6 days after lastMonday

    // STEP 2: Create list of all dates from lastMonday to lastSunday
    const weeklyDates = [];
    for (let d = new Date(lastMonday); d <= lastSunday; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
        weeklyDates.push(dateStr);
        dateTotals[dateStr] = { completed: 0, total: 0 };
    }

    // STEP 3: Loop through progress data
    for (const habitId in progressData) {
        const completion = progressData[habitId]?.completion;
        if (!completion) continue;

        for (const date in completion) {
            if (!weeklyDates.includes(date)) continue;

            const ticks = Array.isArray(completion[date]?.ticks) ? completion[date].ticks : [];
            if (!ticks.length) continue;

            const completed = ticks.filter(Boolean).length;
            const total = ticks.length;

            dateTotals[date].completed += completed;
            dateTotals[date].total += total;
        }
    }

    // STEP 4: Prepare Graph Data
    return weeklyDates.map((dateStr) => {
        const { completed, total } = dateTotals[dateStr];
        const progress = total > 0 ? parseFloat(((completed / total) * 100).toFixed(1)) : 0;

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const day = dayNames[new Date(dateStr).getDay()];

        return { date: dateStr, day, progress };
    });
};

// Category Chart
export const formatCategoryGraph = (habits) => {
    const categoryCount = {};

    for (const habitId in habits) {
        const category = habits[habitId].category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    }

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
};
