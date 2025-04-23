import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProgress, selectDailyGraphData, selectProgressLoading } from '../../store/slices/ProgressSlice';

const FilterInsights = () => {
  const dispatch = useDispatch();
  const progressData = useSelector(selectDailyGraphData);
  const loading = useSelector(selectProgressLoading);
  const userId = useSelector(state => state.auth.userId);

  const [selectedFilter, setSelectedFilter] = useState('thisWeek');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [smartTip, setSmartTip] = useState('');

  useEffect(() => {
    if (userId && !progressData.length) {
      dispatch(fetchProgress(userId));
    } else if (!userId) {
      console.error('No user ID found.');
    }
  }, [dispatch, userId, progressData.length]);

  // Memoize the filtered data for optimization
  const filterData = useMemo(() => {
    const dataArray = Array.isArray(progressData) ? progressData : [];
    if (!dataArray.length) return [];
    
    const today = new Date();
    let start, end;

    switch (selectedFilter) {
      case 'thisWeek':
        const diffToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() + diffToMonday);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;

      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case 'custom':
        start = new Date(startDate);
        end = new Date(endDate);
        break;

      default:
        return [];
    }

    return dataArray.filter((entry) => {
      const date = new Date(entry.date);
      return date >= start && date <= end && entry.progress > 0;
    });
  }, [selectedFilter, startDate, endDate, progressData]);

  useEffect(() => {
    if (!filterData.length) {
      setSmartTip('No data in selected range.');
    } else {
      generateInsight(filterData);
    }
    setFilteredData(filterData);
  }, [filterData]);

  const generateInsight = (data) => {
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

  if (loading) {
    return <div>Loading progress data...</div>;
  }

  return (
    <div className="filter-insight-container">
      <div className="filter-buttons">
        <button onClick={() => { setSelectedFilter('thisWeek'); setShowCalendar(false); }} className={selectedFilter === 'thisWeek' ? 'active' : ''}>This Week</button>
        <button onClick={() => { setSelectedFilter('thisMonth'); setShowCalendar(false); }} className={selectedFilter === 'thisMonth' ? 'active' : ''}>This Month</button>
        <button onClick={() => { setSelectedFilter('custom'); setShowCalendar(true); }} className={selectedFilter === 'custom' ? 'active' : ''}>Custom</button>
      </div>

      {showCalendar && selectedFilter === 'custom' && (
        <div className="calendar-range">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      )}

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

      {smartTip && (
        <div className="smart-tip">
          <strong>💡 Tip:</strong> {smartTip}
        </div>
      )}
    </div>
  );
};

export default FilterInsights;
