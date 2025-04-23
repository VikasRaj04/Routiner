import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCategoryGraph } from "../../utils/progressService";
import { useSelector } from "react-redux";

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded-md border text-sm">
        <p className="text-gray-700 font-semibold">{payload[0].name}</p>
        <p className="text-blue-500">Habits: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CategoryGraph = () => {
  const COLORS = React.useMemo(() => [
    "#6366f1", "#10b981", "#f59e0b", "#f87171", "#3b82f6", "#14b8a6"
  ], []);

  const habits = useSelector((state) => state.habits.habits);
  const data = formatCategoryGraph(habits);

  const isDataEmpty = !data.length || data.every(item => item.progress === 0);

  return (
    <div className="flex flex-col items-center category-graph">
      <h2 className="text-lg font-semibold mb-2">Habit Categories</h2>
      {isDataEmpty ? (
        <p className="text-sm text-gray-500 mt-2">No data available for Categories</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25} // Donut Chart Effect
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryGraph;
