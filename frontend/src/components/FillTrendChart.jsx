import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

function aggregateByDay(records) {
  const grouped = {};
  records.forEach((c) => {
    if (c.status !== "completed") return;
    const day = c.collectedAt.split("T")[0];
    if (!grouped[day]) grouped[day] = { date: day, totalWeight: 0, count: 0 };
    grouped[day].totalWeight += c.weightKg;
    grouped[day].count += 1;
  });
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

export default function FillTrendChart({ collections }) {
  const { theme } = useTheme();
  const data = useMemo(() => aggregateByDay(collections), [collections]);

  return (
    <div className="panel">
      <h3 className="panel__title">Collection Weight Trend</h3>
      {data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">📈</div>
          <p className="empty-state__text">
            No completed collections in the selected range.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: theme.colors.textMuted }} />
            <YAxis tick={{ fontSize: 12, fill: theme.colors.textMuted }} />
            <Tooltip
              contentStyle={{
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.sm,
                fontFamily: theme.fontFamily,
                boxShadow: theme.shadow.md,
              }}
            />
            <Line
              type="monotone"
              dataKey="totalWeight"
              name="Total Weight (kg)"
              stroke={theme.colors.primary}
              strokeWidth={2.5}
              dot={{ r: 4, fill: theme.colors.primary, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
