import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../store/slices/historySlice";
import { selectUserId } from "../store/slices/AuthSlice";
import "./styles/History.css";
import { LifetimeHistory, Sidebar, StreaklyHistory } from "../components";

const History = () => {
    const dispatch = useDispatch();
    const { historyList, loading, error } = useSelector((state) => state.history);
    const userId = useSelector(selectUserId);
    const isGuest = !userId; // ✅ Fix: Guest ko userId se check karna

    const [activeTab, setActiveTab] = useState("Daily"); // Default: Daily

    useEffect(() => {
        dispatch(fetchHistory(userId));
    }, [dispatch, userId]);

    // 🟢 Tab Change Handler
    const handleTabChange = (tab) => {
        if (isGuest && (tab === "Weekly" || tab === "Streakly" || tab === "Lifetime")) {
            alert("🔒 Please login to access this feature!");
            return;
        }
        setActiveTab(tab);
    };


    // 🟢 Sort Data (Latest First)
    const sortedHistory = [...historyList].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    // 🟢 Grouping by Date
    const historyByDate = sortedHistory.reduce((acc, entry) => {
        const dateKey = new Date(entry.timestamp.seconds * 1000).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(entry);
        return acc;
    }, {});


    // 🟢 Daily History - Filter Only Today's Data
    const today = new Date().toLocaleDateString(); // Aaj ki date
    const dailyHistory = sortedHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000).toLocaleDateString();
        return entryDate === today;
    });


    // 🟢 Weekly History - Filter Last 7 Days Data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Last 7 days ka starting point

    const weeklyHistory = sortedHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp.seconds * 1000);
        return entryDate >= sevenDaysAgo; // Sirf last 7 days ki entries allow hongi
    });


    return (
        <div className="history-page">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="history-content">
                <h2 className="history-title">📜 Activity History</h2>

                {/* 🟢 Tabs */}
                <div className="history-tabs">
                    {["Daily", "Weekly", "Streakly", "Lifetime"].map((tab) => (
                        <div
                            key={tab}
                            className={`history-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* 🟢 Show Different Data Based on Selected Tab */}
                {activeTab === "Daily" && (
                    <>
                        {loading && <p className="history-loading">⏳ Loading history...</p>}
                        {error && <p className="history-error">⚠ Error: {error}</p>}
                        {!loading && !error && dailyHistory.length === 0 && (
                            <p className="history-empty">🚀 No history available for today.</p>
                        )}
                        {dailyHistory.map((entry) => (
                            <div key={entry.id} className={`history-card ${entry.action.toLowerCase()}`}>
                                <div className="history-info">
                                    <strong className="habit-name">{entry.habitName}</strong>
                                    <span className="history-action">{entry.action}</span>
                                </div>
                                <span className="history-time">
                                    🕒 {new Date(entry.timestamp.seconds * 1000).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </>
                )}


                {activeTab === "Weekly" && (
                    <>
                        {loading && <p className="history-loading">⏳ Loading history...</p>}
                        {error && <p className="history-error">⚠ Error: {error}</p>}
                        {!loading && !error && weeklyHistory.length === 0 && (
                            <p className="history-empty">📅 No history available for the past 7 days.</p>
                        )}
                        {weeklyHistory.map((entry) => (
                            <div key={entry.id} className={`history-card ${entry.action.toLowerCase()}`}>
                                <div className="history-info">
                                    <strong className="habit-name">{entry.habitName}</strong>
                                    <span className="history-action">{entry.action}</span>
                                </div>
                                <span className="history-time">
                                    📅 {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}
                                    🕒 {new Date(entry.timestamp.seconds * 1000).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </>
                )}


                {activeTab === "Streakly" && (
                    <StreaklyHistory />
                )}

                {activeTab === 'Lifetime' && (
                    <LifetimeHistory />
                )}
            </div>
        </div>

    );
};

export default History;
