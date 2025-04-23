import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProgress,
  selectDailyGraphData,
} from "../../store/slices/ProgressSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomDot = ({ cx, cy }) => (
  <circle className="sparkle-dot" cx={cx} cy={cy} r={3.5} />
);

const DailyGraph = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const dailyData = useSelector(selectDailyGraphData);


  const isDataEmpty = !dailyData.length || dailyData.every((item) => item.progress === 0);

  useEffect(() => {
    if (userId && !dailyData.length) {
      dispatch(fetchProgress(userId));
    }
  }, [userId, dispatch, dailyData.length]);

  return (
    <div className="daily-graph-container">
      <h2 className="daily-graph-title">📈 Last 10 Days Progress</h2>
      {isDataEmpty ? (
        <p className="daily-graph-empty">No data available for the last 10 days.</p>
      ) : (
        <ResponsiveContainer width="100%" height={330}>
          <AreaChart
            data={dailyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3843FF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#3843FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" className="graph-grid" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              height={60}
              stroke="#aaa"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#aaa" />
            <Tooltip
              contentStyle={{ borderRadius: 10 }}
              labelStyle={{ fontWeight: "bold" }}
              itemStyle={{ color: "#3843FF" }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#3843FF"
              fill="url(#colorProgress)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DailyGraph;
