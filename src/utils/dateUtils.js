export const generateCalendarDates = (year, month) => {
    const dates = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = lastDayOfMonth.getDate();

    // Previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
        dates.push({
            date: new Date(prevYear, prevMonth, prevMonthLastDay - i),
            isCurrentMonth: false,
        });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
        dates.push({
            date: new Date(year, month, day),
            isCurrentMonth: true,
        });
    }

    // Next month's leading days to complete the grid (total should be multiple of 7)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (dates.length % 7 !== 0) {
        const nextDate = dates.length - (startDay + totalDays) + 1;
        dates.push({
            date: new Date(nextYear, nextMonth, nextDate),
            isCurrentMonth: false,
        });
    }

    return dates;
};
