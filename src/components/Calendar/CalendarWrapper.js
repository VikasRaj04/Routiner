import React, { useEffect, useState, useCallback } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserHabits } from "../../store/slices/habitSlice";

const CalendarWrapper = ({ onDateClick }) => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const habits = useSelector(state => state.habits);
    const totalHabits = habits.totalHabits;
    const futureHabits = habits.futureHabits;

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserHabits(userId));
        }
    }, [userId, dispatch]);

    const [isWeeklyView, setIsWeeklyView] = useState(false);

    const toggleView = useCallback(() => {
        setIsWeeklyView(prev => !prev);
    }, []);

    return (
        <div className="calendar-section">
            <div className="calendar-topbar">
                <h3 className="calendar-title">
                    {isWeeklyView ? "🗓 Weekly Calendar" : "📅 Monthly Calendar"}
                </h3>

                <button onClick={toggleView} className="view-toggle-btn">
                    {isWeeklyView ? "📅 Monthly View" : "🗓 Weekly View"}
                </button>
            </div>

            {isWeeklyView ? (
                <WeeklyCalendar onDateClick={onDateClick} />
            ) : (
                <CalendarGrid
                    onDateClick={onDateClick}
                    markedDates={totalHabits}
                    futureHabits={futureHabits}
                />
            )}
        </div>
    );
};

export default CalendarWrapper;
