import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ToolTrip,
  ResponsiveContainer,
  Legend,
} from "recharts";
const CustomPieChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius=""/>
      </PieChart>
    </ResponsiveContainer>
  );
};
export default CustomPieChart;
