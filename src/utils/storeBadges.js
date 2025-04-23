import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Auto-generator for multi-streak badges (e.g. 1x to 100x or more)
const generateMultiStreakBadges = (maxStreaks = 100) => {
    return Array.from({ length: maxStreaks }, (_, streakCount) => {
        const totalDays = 21 * (streakCount + 1); // Adjusting for 1-based streak count
        return {
            badgeId: `streak_${streakCount + 1}`,
            name: `${streakCount + 1}x Streaker`,
            emoji: "🔥",
            description: `21-day streak in ${streakCount + 1} different habits (${totalDays} total days).`,
            type: "streak-multi",
        };
    });
};

export const storeBadges = async () => {
    const badgeList = [
        // 🏁 Starter Achievements
        {
            badgeId: "starter",
            name: "Starter",
            emoji: "🆕",
            description: "Created your first habit.",
            type: "onboarding",
        },
        {
            badgeId: "firstComplete",
            name: "First Complete",
            emoji: "✅",
            description: "Marked your first habit as done.",
            type: "onboarding",
        },

        // 🔥 Daily Performance
        {
            badgeId: "perfectDay",
            name: "Perfect Day",
            emoji: "🌟",
            description: "Completed all habits for the day.",
            type: "daily",
        },
        {
            badgeId: "earlyBird",
            name: "Early Bird",
            emoji: "⚡",
            description: "Completed all habits before 9 AM.",
            type: "daily",
        },
        {
            badgeId: "consistentDay",
            name: "Consistent Day",
            emoji: "📅",
            description: "Completed at least 80% habits in a day.",
            type: "daily",
        },

        // 🧮 Completion Based
        {
            badgeId: "initiator",
            name: "Initiator",
            emoji: "🥉",
            description: "Completed any habit 10 times.",
            type: "completion",
        },
        {
            badgeId: "progressor",
            name: "Progressor",
            emoji: "🥈",
            description: "Completed any habit 50 times.",
            type: "completion",
        },
        {
            badgeId: "performer",
            name: "Performer",
            emoji: "🥇",
            description: "Completed any habit 100 times.",
            type: "completion",
        },
        {
            badgeId: "dailyDevotee",
            name: "Daily Devotee",
            emoji: "🧘",
            description: "Completed any habit 365 times.",
            type: "completion",
        },

        // 📊 Progress Stats
        {
            badgeId: "weeklyWarrior",
            name: "Weekly Warrior",
            emoji: "📈",
            description: "Achieved 90%+ average weekly completion.",
            type: "stats",
        },
        {
            badgeId: "flawlessMonth",
            name: "Flawless Month",
            emoji: "📉",
            description: "100% completion in any habit for a month.",
            type: "stats",
        },
        {
            badgeId: "consistentClimber",
            name: "Consistent Climber",
            emoji: "📊",
            description: "70%+ completion for 3 weeks in a row.",
            type: "stats",
        },

        // 🕰️ Time Commitment
        {
            badgeId: "oneMonthFocus",
            name: "One-Month Focus",
            emoji: "⏳",
            description: "Habit tracked for over 30 days.",
            type: "time",
        },
        {
            badgeId: "sixMonthSteady",
            name: "Six-Month Steady",
            emoji: "🕰️",
            description: "Habit tracked for 6 months.",
            type: "time",
        },
        {
            badgeId: "yearlyLegend",
            name: "Yearly Legend",
            emoji: "📆",
            description: "Habit tracked for 1 full year.",
            type: "time",
        },

        // 🧠 Streak Milestones (Multi-habit)
        {
            badgeId: "tripleThreat",
            name: "Triple Threat",
            emoji: "🧩",
            description: "21-day streak in 3 different habits.",
            type: "streak-milestone",
        },
        {
            badgeId: "habitHero",
            name: "Habit Hero",
            emoji: "🎯",
            description: "21-day streak in 7 different habits.",
            type: "streak-milestone",
        },
        {
            badgeId: "masterOfRoutine",
            name: "Master of Routine",
            emoji: "🧠",
            description: "21-day streak in 21 different habits.",
            type: "streak-milestone",
        },

        // 🔁 Streak-Multi (auto-generated)
        ...generateMultiStreakBadges(100), // Change number to increase max streak level
    ];

    try {
        const badgeCollectionRef = collection(db, "badges");

        for (const badge of badgeList) {
            const badgeRef = doc(badgeCollectionRef, badge.badgeId);
            await setDoc(badgeRef, badge);
        }

    } catch (error) {
        console.error("❌ Error storing badges:", error);
    }
};
