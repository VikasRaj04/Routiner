import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../store/slices/historySlice";
import { selectUserId } from "../store/slices/AuthSlice";
import { LifetimeHistory, Sidebar, StreaklyHistory } from "../components";
import "./styles/History.css";
import Topbar from "../utils/Topbar";


const History = () => {
    const dispatch = useDispatch();
    const { historyList, loading, error } = useSelector((state) => state.history);
    const userId = useSelector(selectUserId);
    const isGuest = !userId;

    const [activeTab, setActiveTab] = useState("Daily");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        if (userId) {
            dispatch(fetchHistory(userId));
        }
    }, [dispatch, userId]);

    // 🟢 Tab Change Handler
    const handleTabChange = (tab) => {
        if (isGuest && ["Weekly", "Streakly", "Lifetime"].includes(tab)) {
            alert("🔒 Please login to access this feature!");
            return;
        }
        setActiveTab(tab);
    };

    // 🟢 Memoize Sorting and Grouping Logic
    const sortedHistory = useMemo(() => {
        return [...historyList].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    }, [historyList]);

    // const historyByDate = useMemo(() => {
    //     return sortedHistory.reduce((acc, entry) => {
    //         const dateKey = new Date(entry.timestamp.seconds * 1000).toLocaleDateString();
    //         if (!acc[dateKey]) acc[dateKey] = [];
    //         acc[dateKey].push(entry);
    //         return acc;
    //     }, {});
    // }, [sortedHistory]);

    // 🟢 Filter Today's History
    // const today = useMemo(() => new Date().toLocaleDateString(), []);
    const dailyHistory = useMemo(() => {
        const todayFormatted = new Date().toISOString().split('T')[0]; // Get date in 'yyyy-mm-dd' format

        const filtered = sortedHistory.filter(entry => {
            const entryTimestamp = new Date(entry.timestamp); // Directly use the timestamp as milliseconds
            const entryFormattedDate = entryTimestamp.toISOString().split('T')[0]; // Format entry date similarly

            return entryFormattedDate === todayFormatted;
        });

        return filtered;
    }, [sortedHistory]);


    // 🟢 Filter Last 7 Days History
    const sevenDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }, []);
    const weeklyHistory = useMemo(() => {
        return sortedHistory.filter(entry => {

            // Since the timestamp is in milliseconds, use it directly
            const entryTimestamp = new Date(entry.timestamp);  // Use timestamp directly (in milliseconds)


            // Normalize entry timestamp to midnight
            entryTimestamp.setHours(0, 0, 0, 0);

            return entryTimestamp >= new Date(sevenDaysAgo);  // Compare dates
        });
    }, [sortedHistory, sevenDaysAgo]);


    return (
        <div className="history-page">

            <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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

                <div className="ad">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
                        crossorigin="anonymous"></script>
                    <ins class="adsbygoogle"
                        style="display:block"
                        data-ad-format="fluid"
                        data-ad-layout-key="-ef+6k-30-ac+ty"
                        data-ad-client="ca-pub-3405064387458435"
                        data-ad-slot="5877457995"></ins>
                    <script>
                        (adsbygoogle = window.adsbygoogle || []).push({ });
                    </script>
                </div>

                {/* 🟢 Show Different Data Based on Selected Tab */}
                {activeTab === "Daily" && (
                    <>
                        {loading && <p className="history-loading">⏳ Loading history...</p>}
                        {error && <p className="history-error">⚠ Error: {error}</p>}
                        {!loading && !error && dailyHistory.length === 0 && (
                            <p className="history-empty">🚀 No history available for today.</p>
                        )}
                        {dailyHistory.map((entry) => {
                            // Convert timestamp directly without multiplying by 1000 (since it's in milliseconds)
                            const timestamp = new Date(entry.timestamp);  // Assuming entry.timestamp is already in milliseconds

                            return (
                                <div key={entry.id} className={`history-card ${entry.action.toLowerCase()}`}>
                                    <div className="history-info">
                                        <strong className="habit-name">{entry.habitName}</strong>
                                        <span className="history-action">{entry.action}</span>
                                    </div>
                                    <span className="history-time">
                                        🕒 {timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            );
                        })}
                    </>
                )}

                {activeTab === "Weekly" && (
                    <>
                        {loading && <p className="history-loading">⏳ Loading history...</p>}
                        {error && <p className="history-error">⚠ Error: {error}</p>}
                        {!loading && !error && weeklyHistory.length === 0 && (
                            <p className="history-empty">📅 No history available for the past 7 days.</p>
                        )}
                        {weeklyHistory.map((entry) => {
                            // Convert timestamp directly without multiplying by 1000 (since it's in milliseconds)
                            const timestamp = new Date(entry.timestamp);  // Assuming entry.timestamp is already in milliseconds

                            return (
                                <div key={entry.id} className={`history-card ${entry.action.toLowerCase()}`}>
                                    <div className="history-info">
                                        <strong className="habit-name">{entry.habitName}</strong>
                                        <span className="history-action">{entry.action}</span>
                                    </div>
                                    <span className="history-time">
                                        📅 {timestamp.toLocaleDateString()} 🕒 {timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            );
                        })}
                    </>
                )}


                {activeTab === "Streakly" && <StreaklyHistory />}
                {activeTab === "Lifetime" && <LifetimeHistory />}


            </div>

            <div className="ad">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
                    crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-format="fluid"
                    data-ad-layout-key="-ef+6k-30-ac+ty"
                    data-ad-client="ca-pub-3405064387458435"
                    data-ad-slot="5877457995"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
        </div>
    );
};

export default History;
