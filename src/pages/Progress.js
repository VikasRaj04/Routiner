// src/pages/Progress.js
import React, { useState } from 'react';
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
// import { useDispatch } from 'react-redux';
import Topbar from '../utils/Topbar';


function Progress() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="progress">
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
