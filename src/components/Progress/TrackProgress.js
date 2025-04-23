import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserHabits } from "../../store/slices/habitSlice";
import { fetchProgressData, addHabitProgress } from "../../firebase/firebaseService";
import { unlockBadges } from "../../utils/unlockBadges";

const TrackProgress = () => {
    const dispatch = useDispatch();
    const { habits, loading } = useSelector((state) => state.habits);
    const currentUser = useSelector((state) => state.auth.user);
    const userId = useSelector(state => state.auth.userId);
    const [dates, setDates] = useState([]);
    const [progressData, setProgressData] = useState({});

    // Generate current week dates
    useEffect(() => {
        dispatch(fetchUserHabits(userId));

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
    }, [dispatch, userId]);

    // Load progress data from Firebase (or localStorage as fallback)
    useEffect(() => {
        if (currentUser) {
            const cached = localStorage.getItem(`${currentUser.uid}-progress`);
            if (cached) {
                setProgressData(JSON.parse(cached));
            }

            fetchProgressData(currentUser.uid).then((data) => {
                const freshData = data.progressData || {};
                setProgressData(freshData);
                localStorage.setItem(`${currentUser.uid}-progress`, JSON.stringify(freshData));
            });
        }
    }, [currentUser]);

    // Handle habit checkbox interaction
    const handleCheckboxChange = useCallback(
        async (habitId, date, index, timesPerDay, habitName, category) => {
            if (!currentUser) return;

            // Optimistically update UI
            setProgressData((prev) => {
                const prevTicks = prev[habitId]?.completion?.[date]?.ticks || new Array(timesPerDay).fill(false);
                const newTicks = [...prevTicks];
                newTicks[index] = true;

                const updated = {
                    ...prev,
                    [habitId]: {
                        ...prev[habitId],
                        completion: {
                            ...prev[habitId]?.completion,
                            [date]: {
                                ticks: newTicks,
                            },
                        },
                    },
                };

                // Persist to localStorage
                localStorage.setItem(`${currentUser.uid}-progress`, JSON.stringify(updated));
                return updated;
            });

            try {
                await addHabitProgress(currentUser.uid, habitId, date, index, timesPerDay, habitName, category);

                // Check for badge unlocks
                const todayCompletedHabits = habits.filter((habit) => {
                    const ticks = progressData[habit.id]?.completion?.[date]?.ticks || [];
                    return ticks.every(Boolean);
                });

                const newBadges = await unlockBadges({
                    userId: currentUser.uid,
                    userHabits: habits,
                    todayCompletedHabits,
                    todayAllHabits: habits,
                    currentDate: new Date(date),
                });

                if (newBadges.length > 0) {
                    console.log("🎉 New badges unlocked:", newBadges);
                    // You can add a toast/notification here
                }
            } catch (error) {
                console.error("Error updating progress or unlocking badges:", error);
            }
        },
        [currentUser, habits, progressData]
    );

    // Memoize filtered habits to avoid unnecessary recalculations
    const filteredHabits = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return habits.filter((habit) => {
            const startDate = habit.startDate ? new Date(habit.startDate) : null;
            return !startDate || startDate <= today;
        });
    }, [habits]);

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
                        {filteredHabits.map((habit) => {
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
                                                {completionArray.map((completed, idx) =>
                                                    dateObj.isPast ? (
                                                        <span key={idx} className={completed ? "tick" : "cross"} />
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
