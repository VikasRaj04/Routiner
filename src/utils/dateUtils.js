export const generateCalendarDates = (year, month) => {
    const dates = [];

    // Get the first and last day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = lastDayOfMonth.getDate();

    // Determine previous month and year
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    // Add previous month's trailing days
    for (let i = startDay - 1; i >= 0; i--) {
        dates.push({
            date: new Date(prevYear, prevMonth, prevMonthLastDay - i),
            isCurrentMonth: false,
        });
    }

    // Add current month's days
    for (let day = 1; day <= totalDays; day++) {
        dates.push({
            date: new Date(year, month, day),
            isCurrentMonth: true,
        });
    }

    // Determine next month and year
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    // Add next month's leading days to complete the grid (multiple of 7)
    const daysInNextMonth = 7 - dates.length % 7;
    for (let i = 1; i <= daysInNextMonth; i++) {
        dates.push({
            date: new Date(nextYear, nextMonth, i),
            isCurrentMonth: false,
        });
    }

    return dates;
};
