import React from 'react';
import { useSelector } from 'react-redux';

function StreaklyHistory() {

    const { historyList, loading, error } = useSelector((state) => state.history);
    const sortedHistory = [...historyList].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    // 🟢 Streakly History - Last 21 Days Data Fetch
    const twentyOneDaysAgo = new Date();
    twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21); // 21 days back ka starting point

    const streaklyHistory = sortedHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000);
        return entryDate >= twentyOneDaysAgo; // Sirf last 21 din ka data lenge
    });

    // 🟢 3 Streak Parts (Har Column 7 Days Ka)
    const firstStreak = streaklyHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000);
        return entryDate >= twentyOneDaysAgo && entryDate < new Date(twentyOneDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000);
    });

    const secondStreak = streaklyHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000);
        return entryDate >= new Date(twentyOneDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000) &&
            entryDate < new Date(twentyOneDaysAgo.getTime() + 14 * 24 * 60 * 60 * 1000);
    });

    const thirdStreak = streaklyHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000);
        return entryDate >= new Date(twentyOneDaysAgo.getTime() + 14 * 24 * 60 * 60 * 1000);
    });

    return (
        <div className="streak-section">
            {/* 🟢 21-Day Streak Grid */}
            <div className="streak-grid">
                {/* Column 1 - Last 21-15 Days */}
                <div className="streak-box">
                    <h3 className="streak-header">Last 21-15 Days</h3>
                    <ul className="streak-list">
                        {firstStreak.length === 0 ? (
                            <li className="no-data">No data available</li>
                        ) : (
                            firstStreak.map(entry => (
                                <li key={entry.id} className="streak-item">
                                    <span className="streak-name">{entry.habitName}</span>
                                    <span className="streak-date">{new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Column 2 - Last 14-8 Days */}
                <div className="streak-box">
                    <h3 className="streak-header">Last 14-8 Days</h3>
                    <ul className="streak-list">
                        {secondStreak.length === 0 ? (
                            <li className="no-data">No data available</li>
                        ) : (
                            secondStreak.map(entry => (
                                <li key={entry.id} className="streak-item">
                                    <span className="streak-name">{entry.habitName}</span>
                                    <span className="streak-date">{new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Column 3 - Last 7 Days */}
                <div className="streak-box">
                    <h3 className="streak-header">Last 7 Days</h3>
                    <ul className="streak-list">
                        {thirdStreak.length === 0 ? (
                            <li className="no-data">No data available</li>
                        ) : (
                            thirdStreak.map(entry => (
                                <li key={entry.id} className="streak-item">
                                    <span className="streak-name">{entry.habitName}</span>
                                    <span className="streak-date">{new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default StreaklyHistory
