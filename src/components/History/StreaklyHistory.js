import React from 'react';
import { useSelector } from 'react-redux';

// ✅ Fixed: Directly use `new Date(entry.timestamp)` assuming it's in milliseconds
const groupHistoryByDateRange = (historyList, startDate, endDate) => {
    return historyList.filter(entry => {
        const entryDate = new Date(entry.timestamp); 
        return entryDate >= startDate && entryDate < endDate;
    });
};

function StreaklyHistory() {
    const { historyList } = useSelector((state) => state.history);

    // ✅ Sort using raw timestamp
    const sortedHistory = [...historyList].sort((a, b) => b.timestamp - a.timestamp);

    // ✅ Date Ranges
    const twentyOneDaysAgo = new Date();
    twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21);

    const last21to15Days = new Date(twentyOneDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000);
    const last14to8Days = new Date(twentyOneDaysAgo.getTime() + 14 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(twentyOneDaysAgo.getTime() + 21 * 24 * 60 * 60 * 1000);

    // ✅ Grouped Streaks
    const firstStreak = groupHistoryByDateRange(sortedHistory, twentyOneDaysAgo, last21to15Days);
    const secondStreak = groupHistoryByDateRange(sortedHistory, last21to15Days, last14to8Days);
    const thirdStreak = groupHistoryByDateRange(sortedHistory, last14to8Days, last7Days);

    const renderStreak = (streak, header) => (
        <div className="streak-box">
            <h3 className="streak-header">{header}</h3>
            <ul className="streak-list">
                {streak.length === 0 ? (
                    <li className="no-data">No data available</li>
                ) : (
                    streak.map(entry => (
                        <li key={entry.id} className="streak-item">
                            <span className="streak-name">{entry.habitName}</span>
                            <span className="streak-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );

    return (
        <div className="streak-section">
            <div className="streak-grid">
                {renderStreak(firstStreak, 'Last 21-15 Days')}
                {renderStreak(secondStreak, 'Last 14-8 Days')}
                {renderStreak(thirdStreak, 'Last 7 Days')}
            </div>
        </div>
    );
}

export default StreaklyHistory;
