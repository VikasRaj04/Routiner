import React, { useState, useMemo, useCallback } from "react";
import { generateCalendarDates } from "../../utils/dateUtils";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const CalendarGrid = React.memo(({ onDateClick, markedDates = [], futureHabits = [] }) => {
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());

  const today = todayDate.toDateString();

  // Memoize the result of calendar dates generation to prevent unnecessary recalculations
  const dates = useMemo(() => generateCalendarDates(currentYear, currentMonth), [currentYear, currentMonth]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  }, [currentMonth]);

  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // yyyy-mm-dd format
  }, []);

  // Memoize the function to get future habit name to prevent recalculations on each render
  const getFutureHabitName = useCallback((date) => {
    const formattedDate = formatDate(date);
    const futureHabit = futureHabits.find(habit => habit.startDate === formattedDate);
    return futureHabit ? futureHabit.name : null;
  }, [futureHabits, formatDate]);

  // Memoize the function to get marked habit name to prevent recalculations on each render
  const getMarkHabitName = useCallback((date) => {
    const formattedDate = formatDate(date);
    const markHabit = markedDates.find(habit => habit.markDate === formattedDate);
    return markHabit ? markHabit.name : null;
  }, [markedDates, formatDate]);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn" aria-label="Previous Month">⏮</button>
        <div className="calendar-month">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="year-input"
          />
        </div>
        <button onClick={handleNextMonth} className="nav-btn" aria-label="Next Month">⏭</button>
      </div>

      <div className="day-labels">
        {dayLabels.map((day) => (
          <div key={day} className="day-label">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {dates.map((dateObj, index) => {
          const day = dateObj.date.getDate();
          const isToday = dateObj.date.toDateString() === today;
          const isInactive = !dateObj.isCurrentMonth;
          const markedHabitName = getMarkHabitName(dateObj.date);
          const futureHabitName = getFutureHabitName(dateObj.date);

          return (
            <div
              key={index}
              className={`calendar-cell 
                ${isToday ? "today" : ""} 
                ${isInactive ? "inactive" : ""}
                ${markedHabitName ? "marked" : ""} 
                ${futureHabitName ? "future" : ""}
                `}
              onClick={() => onDateClick(dateObj.date)}
            >
              <span className="date-number">{day}</span>
              {futureHabitName && (
                <span className="future-habit-name" title="New Habit Starts">
                  {futureHabitName}
                </span>
              )}
              {markedHabitName && (
                <span className="marked-habit-name">
                  {markedHabitName}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
