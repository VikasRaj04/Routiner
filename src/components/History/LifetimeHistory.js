import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLifetimeHistory } from "../../store/slices/historySlice";
import LifetimeCard from "./LifetimeCard";
import { selectUserId } from "../../store/slices/AuthSlice";

const LifetimeHistory = () => {
  const dispatch = useDispatch();
  const { lifetimeHistory = {}, loading, error } = useSelector((state) => state.history);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    dispatch(fetchLifetimeHistory(userId));
  }, [dispatch, userId]);

  const groupedData = useMemo(() => {
    return Object.values(lifetimeHistory).flat().reduce((acc, entry) => {
      const timestamp = entry.timestamp;
      if (!timestamp) return acc;

      const date = new Date(timestamp); // ✅ Use raw timestamp
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {});
  }, [lifetimeHistory]);

  const sortedMonths = useMemo(() => {
    return Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
  }, [groupedData]);

  const handleMonthClick = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="lifetime-history-container">
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!selectedMonth ? (
        <div className="lifetime-history-grid">
          {sortedMonths.map((key) => {
            const [month, yearStr] = key.split(" ");
            const year = parseInt(yearStr, 10); // ✅ convert to number
            return <LifetimeCard key={key} month={month} year={year} onClick={handleMonthClick} />;
            
          })}
        </div>
      ) : (
        <div className="selected-month-container">
          <button className="back-button" onClick={() => setSelectedMonth(null)}>
            ← Back
          </button>
          <h2 className="selected-month-title">{selectedMonth} {selectedYear} History</h2>
          
          <div className="history-cards-container">
            {groupedData[`${selectedMonth} ${selectedYear}`]
              .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              .map((entry, index) => (
                <div key={index} className="history-card">
                  <p className="history-habit-name">{entry.habitName || "Unnamed Habit"}</p>
                  <p className="history-action">{entry.action}</p>
                  <span className="history-date">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default LifetimeHistory;
