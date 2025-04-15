import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserHabits } from "../../store/slices/habitSlice";
import {
    fetchProgressData,
    addHabitProgress,
} from "../../firebase/firebaseService";
import { unlockBadges } from "../../utils/unlockBadges";

const TrackProgress = () => {
    const dispatch = useDispatch();
    const { habits, loading } = useSelector((state) => state.habits);
    const currentUser = useSelector((state) => state.auth.user);
    const [dates, setDates] = useState([]);
    const [progressData, setProgressData] = useState({});

    useEffect(() => {
        dispatch(fetchUserHabits());

        const generateDates = () => {
            const today = new Date();
            const daysArray = Array.from({ length: 7 }, (_, i) => {
                const newDate = new Date();
                newDate.setDate(today.getDate() + i - 4);
                return {
                    dateStr: newDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    }),
                    date: newDate.toISOString().split("T")[0],
                    isToday: i === 4,
                    isPast: i < 4,
                    isFuture: i > 4,
                };
            });
            setDates(daysArray);
        };

        generateDates();

        if (currentUser) {
            fetchProgressData(currentUser.uid).then((data) => {
                setProgressData(data.progressData || {});
            });
        }
    }, [dispatch, currentUser]);

    const handleCheckboxChange = useCallback(
        async (habitId, date, index, timesPerDay, habitName, category) => {
            if (!currentUser) return;

            setProgressData((prev) => ({
                ...prev,
                [habitId]: {
                    ...prev[habitId],
                    completion: {
                        ...prev[habitId]?.completion,
                        [date]: {
                            ticks:
                                prev[habitId]?.completion?.[date]?.ticks?.length === timesPerDay
                                    ? prev[habitId].completion[date].ticks.map((v, i) =>
                                          i === index ? true : v
                                      )
                                    : new Array(timesPerDay)
                                          .fill(false)
                                          .map((_, i) => (i === index ? true : false)),
                        },
                    },
                },
            }));

            try {
                await addHabitProgress(
                    currentUser.uid,
                    habitId,
                    date,
                    index,
                    timesPerDay,
                    habitName,
                    category
                );

                // 🏆 Badge unlock check
                const userHabits = habits;

                const todayCompletedHabits = habits.filter((habit) => {
                    const ticks =
                        progressData[habit.id]?.completion?.[date]?.ticks || [];
                    return ticks.every(Boolean);
                });

                const newBadges = await unlockBadges({
                    userId: currentUser.uid,
                    userHabits,
                    todayCompletedHabits,
                    todayAllHabits: habits,
                    currentDate: new Date(date),
                });

                if (newBadges.length > 0) {
                    console.log("🎉 New badges unlocked:", newBadges);
                    // 🥳 Optionally: toast, confetti, etc.
                }
            } catch (error) {
                console.error("Error updating progress or unlocking badges:", error);
            }
        },
        [currentUser, habits, progressData]
    );

    if (loading) return <p>Loading habits...</p>;

    return (
        <div className="habit-tracker">
            <h2 className="sub-heading-h2">Habit Completion Chart</h2>
            <div className="habit-table-container">
                <table className="habit-table">
                    <thead>
                        <tr>
                            <th className="th-habit-head">Habit</th>
                            {dates.map((date, index) => (
                                <th
                                    key={index}
                                    className={
                                        date.isToday
                                            ? "today-header"
                                            : date.isPast
                                            ? "past-header"
                                            : "future-header"
                                    }
                                >
                                    {date.dateStr}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habits
                            .filter((habit) => {
                                // ✅ Allow if startDate is missing/empty/null
                                if (!habit.startDate || habit.startDate === "" || habit.startDate === null) {
                                    return true;
                                }

                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const startDateObj = new Date(habit.startDate);
                                startDateObj.setHours(0, 0, 0, 0);

                                // ❌ Exclude future startDate
                                return startDateObj <= today;
                            })
                            .map((habit) => {
                                const timesPerDay = parseInt(habit.frequency.split("/")[0], 10);

                                return (
                                    <tr key={habit.id}>
                                        <td className="habit-name">
                                            {habit.name} ({habit.frequency})
                                        </td>
                                        {dates.map((dateObj, index) => {
                                            const completionArray =
                                                progressData[habit.id]?.completion?.[dateObj.date]?.ticks ||
                                                new Array(timesPerDay).fill(false);

                                            return (
                                                <td key={index} className="habit-cell">
                                                    {completionArray
                                                        .slice(0, timesPerDay)
                                                        .map((completed, idx) =>
                                                            dateObj.isPast ? (
                                                                <span
                                                                    key={idx}
                                                                    className={completed ? "tick" : "cross"}
                                                                ></span>
                                                            ) : (
                                                                <input
                                                                    key={idx}
                                                                    type="checkbox"
                                                                    checked={completed}
                                                                    disabled={dateObj.isFuture}
                                                                    onChange={() =>
                                                                        handleCheckboxChange(
                                                                            habit.id,
                                                                            dateObj.date,
                                                                            idx,
                                                                            timesPerDay,
                                                                            habit.name,
                                                                            habit.category
                                                                        )
                                                                    }
                                                                    className="checkbox"
                                                                />
                                                            )
                                                        )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackProgress;
