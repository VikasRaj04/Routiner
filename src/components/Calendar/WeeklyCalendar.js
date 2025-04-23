import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserHabits } from "../../store/slices/habitSlice";

const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sun, 1 = Mon...

    // Convert Sunday (0) to 7 for easier handling
    const correctedDay = currentDay === 0 ? 7 : currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() - (correctedDay - 1));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDates.push(d);
    }

    return weekDates;
};

export const WeeklyCalendar = React.memo(({ onDateClick }) => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const totalHabits = useSelector(state => state.habits.totalHabits) || [];

    // Memoize the week dates to prevent unnecessary recalculations
    const weekDates = useMemo(() => getCurrentWeekDates(), []);
    const todayStr = useMemo(() => new Date().toDateString(), []);

    useEffect(() => {
        dispatch(fetchUserHabits(userId));
    }, [dispatch, userId]);

    // Memoize the habit filtering logic to prevent unnecessary re-renders
    const habitsForDate = (date) => {
        return totalHabits.filter(habit => {
            if (!habit.startDate) return true;
            const habitStartDate = new Date(habit.startDate);
            return habitStartDate <= date;
        });
    };

    return (
        <div className="weekly-calendar">
            <div className="calendar-wrapper">
                <div className="day-labels">
                    {dayLabels.map((day, idx) => (
                        <div key={idx} className="day-label">{day}</div>
                    ))}
                </div>

                <div className="calendar-grid weekly-view">
                    {weekDates.map((date, index) => {
                        const isToday = date.toDateString() === todayStr;
                        const habitsForCurrentDate = habitsForDate(date);

                        return (
                            <div
                                key={index}
                                className={`calendar-cell ${isToday ? "today" : ""}`}
                                onClick={() => onDateClick(date)}
                            >
                                <span className="date-number">{date.getDate()}</span>

                                <div className="habit-lines">
                                    {habitsForCurrentDate.map((habit, i) => (
                                        <div key={i} className="habit-line" title={habit.name}>
                                            {habit.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
