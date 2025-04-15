import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { fetchProgress, selectWeeklyGraphData } from "../../store/slices/ProgressSlice";
import { useDispatch, useSelector } from "react-redux";

const WeeklyGraph = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProgress(userId));
    }
  }, [userId, dispatch]);

  const weeklyData = useSelector(selectWeeklyGraphData);

  return (
    <div className="flex flex-col items-center weekly-graph">
      <h2 className="text-lg font-semibold mb-2">Weekly Progress</h2>

      {weeklyData.length === 0 || weeklyData.every(item => item.progress === 0) ? (
        <p className="text-sm text-gray-500 mt-2">No data available for last week.</p>
      ) : (
        <BarChart width={300} height={170} data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" angle={-45} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progress" fill="#8884d8" />
        </BarChart>
      )}
    </div>
  );
};

export default WeeklyGraph;
