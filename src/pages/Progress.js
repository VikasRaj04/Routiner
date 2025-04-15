// src/pages/Progress.js
import React from 'react';
import {
  AchievementBadges,
  CategoryProgressChart,
  FilterInsights,
  Sidebar,
  StatsInsights,
  StatsProgress,
  TrackProgress,
} from '../components';
import './styles/Progress.css';

function Progress() {
  return (
    <div className="progress">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <h1 className="heading">Routiner Progress</h1>
        
        <StatsProgress />
        <TrackProgress />

        <div className="insights">
          <StatsInsights />
          <CategoryProgressChart />
        </div>

        <AchievementBadges />

        <FilterInsights />
      </div>
    </div>
  );
}

export default Progress;
