import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f87171", "#3b82f6", "#14b8a6"];

const renderCustomLabel = ({ name, percent }) => {
  const percentage = (percent * 100).toFixed(0);
  return `${name} (${percentage}%)`;
};

const CategoryProgressChart = () => {
  // Call useSelector directly
  const progress = useSelector((state) => state.progress?.categoryMap) || {};

  // Create chart data directly here (no need for useMemo)
  const chartData = Object.entries(progress).map(([categoryName, habitArray]) => ({
    name: categoryName,
    value: habitArray.length,
  }));

  // Calculate the total habits count
  const totalHabits = chartData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="category-progress-container">
      <h2 className="chart-title">📊 Category-wise Progress</h2>

      {chartData.length === 0 ? (
        <p className="no-data-text">No progress data available.</p>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} habits`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "0.9rem",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="center-label">
            <span className="center-label-value">{totalHabits}</span>
            <span className="center-label-text">Total</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProgressChart;
