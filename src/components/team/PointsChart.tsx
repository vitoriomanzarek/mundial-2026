"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface PointsChartDatum {
  label: string;
  points: number;
}

export default function PointsChart({ data }: { data: PointsChartDatum[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -24 }}>
          <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#71717A"
            tickLine={false}
            axisLine={{ stroke: "#27272A" }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 9]}
            allowDecimals={false}
            stroke="#71717A"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C1C1F",
              border: "1px solid #27272A",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#A1A1AA" }}
            itemStyle={{ color: "#00D9A3" }}
            formatter={(value) => [`${value} pts`, "Puntos"]}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#00D9A3"
            strokeWidth={2}
            dot={{ fill: "#00D9A3", r: 3.5, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
