import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { theme } from "../theme";
import collections from "../data/collections.json";

function aggregateByDay(records) {
  const grouped = {};
  records.forEach((c) => {
    const day = c.collectedAt.split("T")[0];
    if (!grouped[day]) grouped[day] = { date: day, totalWeight: 0, count: 0 };
    grouped[day].totalWeight += c.weightKg;
    grouped[day].count += 1;
  });
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

export default function FillTrendChart() {
  const data = useMemo(() => aggregateByDay(collections), []);

  return (
    <div style={{
      background: theme.colors.surface ?? "#fff",
      borderRadius: theme.radius ?? "12px",
      padding: theme.spacing?.lg ?? "1.5rem",
      boxShadow: theme.shadows?.card ?? "0 1px 4px rgba(0,0,0,0.08)",
    }}>
      <h3 style={{ marginBottom: "1rem" }}>Collection Weight Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border ?? "#eee"} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalWeight"
            name="Total Weight (kg)"
            stroke={theme.colors.primary ?? "#2563eb"}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}