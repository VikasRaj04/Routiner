import React from 'react';
import './CompoDashboard.css';
import {CategoryGraph, DailyGraph, WeeklyGraph} from '../index';


function Graph() {
  return (
    <section className="graphs">

      <div className="graphs-section">
        <div className="main-graph">
          <DailyGraph />
        </div>
        <div className="side-graphs">
          <WeeklyGraph />
          <CategoryGraph />
        </div>
      </div>
    </section>
  )
}

export default Graph
