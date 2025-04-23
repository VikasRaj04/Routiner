import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchProgress, selectWeeklyGraphData } from "../../store/slices/ProgressSlice";
import { useDispatch, useSelector } from "react-redux";

const WeeklyGraph = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const weeklyData = useSelector(selectWeeklyGraphData);

  const isDataEmpty = !weeklyData.length || weeklyData.every(item => item.progress === 0);

  useEffect(() => {
    if (userId && !weeklyData.length) {
      dispatch(fetchProgress(userId));
    }
  }, [userId, dispatch, weeklyData.length]);

  return (
    <div className="flex flex-col items-center weekly-graph">
      <h2 className="text-lg font-semibold mb-2">Weekly Progress</h2>
      {isDataEmpty ? (
        <p className="text-sm text-gray-500 mt-2">No data available for last week.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeeklyGraph;
