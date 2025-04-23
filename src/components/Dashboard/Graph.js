import React from 'react';
import { CategoryGraph, DailyGraph, WeeklyGraph } from '../index';

const Graph = React.memo(() => {
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
  );
});

export default Graph;
