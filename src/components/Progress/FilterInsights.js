import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const FilterInsights = () => {
  const progressData = useSelector((state) => state.progress);
  const [selectedFilter, setSelectedFilter] = useState('thisWeek');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [smartTip, setSmartTip] = useState('');

  useEffect(() => {
    const dataArray = Array.isArray(progressData?.dailyGraph)
      ? progressData.dailyGraph
      : [];

    if (!dataArray.length) {
      setFilteredData([]);
      setSmartTip('');
      return;
    }

    const today = new Date();
    let start, end;

    if (selectedFilter === 'thisWeek') {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      start = new Date(today);
      start.setDate(today.getDate() + diffToMonday);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (selectedFilter === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (selectedFilter === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      setFilteredData([]);
      setSmartTip('');
      return;
    }

    const filtered = dataArray
      .filter((entry) => {
        const date = new Date(entry.date);
        return date >= start && date <= end && entry.progress > 0;
      });

    setFilteredData(filtered);
    generateInsight(filtered);
  }, [selectedFilter, startDate, endDate, progressData]);

  const generateInsight = (data) => {
    if (!data || data.length === 0) {
      setSmartTip('No data in selected range.');
      return;
    }

    const count = {
      Sunday: 0, Monday: 0, Tuesday: 0,
      Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0,
    };

    data.forEach((entry) => {
      const d = new Date(entry.date);
      const day = d.toLocaleDateString('en-US', { weekday: 'long' });
      count[day]++;
    });

    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
    const [mostActive, mostSkipped] = [sorted[0], sorted[sorted.length - 1]];

    if (mostActive[1] === 0) {
      setSmartTip('No habits completed in this range.');
    } else if (mostActive[1] === mostSkipped[1]) {
      setSmartTip('You’re consistent every day! 💪');
    } else {
      setSmartTip(`You're most active on ${mostActive[0]}s, and tend to skip more on ${mostSkipped[0]}s.`);
    }
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="filter-insight-container">

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => { setSelectedFilter('thisWeek'); setShowCalendar(false); }} className={selectedFilter === 'thisWeek' ? 'active' : ''}>This Week</button>
        <button onClick={() => { setSelectedFilter('thisMonth'); setShowCalendar(false); }} className={selectedFilter === 'thisMonth' ? 'active' : ''}>This Month</button>
        <button onClick={() => { setSelectedFilter('custom'); setShowCalendar(true); }} className={selectedFilter === 'custom' ? 'active' : ''}>Custom</button>
      </div>

      {/* Custom Date Inputs */}
      {showCalendar && selectedFilter === 'custom' && (
        <div className="calendar-range">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      )}

      {/* Mini Insights */}
      {filteredData.length > 0 && (
        <ul className="progress-list">
          {filteredData.map((entry, index) => (
            <li key={index} className="progress-entry">
              <span>{formatDisplayDate(entry.date)}</span>
              <div className="mini-bar">
                <div className="mini-fill" style={{ width: `${entry.progress}%` }}></div>
              </div>
              <span className="mini-percent">{entry.progress}%</span>
            </li>
          ))}
        </ul>
      )}

      {/* Smart Tip */}
      {smartTip && (
        <div className="smart-tip">
          <strong>💡 Tip:</strong> {smartTip}
        </div>
      )}
    </div>
  );
};

export default FilterInsights;
