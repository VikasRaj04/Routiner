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

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>

        <TrackProgress />

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>

        <div className="insights">
          <StatsInsights />
          <CategoryProgressChart />
        </div>

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>

        <AchievementBadges />

        <FilterInsights />

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>
      </div>
    </div>
  );
}

export default Progress;
