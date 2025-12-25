import { useMemo } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  data: DataPoint[];
  color: string;
  valuePrefix?: string;
}

export function LineChartCard({
  title,
  data,
  color,
  valuePrefix = "",
}: LineChartCardProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (data.length === 0)
      return { points: "", maxValue: 0, minValue: 0 };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 100;
    const height = 100;
    const padding = 5;

    const pts = data
      .map((d, i) => {
        const x =
          padding +
          (i / (data.length - 1 || 1)) * (width - 2 * padding);
        const y =
          height -
          padding -
          ((d.value - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    return { points: pts, maxValue: max, minValue: min };
  }, [data]);

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const firstValue = data.length > 0 ? data[0].value : 0;
  const change =
    firstValue > 0
      ? ((latestValue - firstValue) / firstValue) * 100
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/60 backdrop-blur-xl"> {/* GEÄNDERT: Vereinheitlichter Card-Stil */}
      {/* GEÄNDERT: Farbige obere Linie */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-slate-400">
            {title}
          </h3>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
            {valuePrefix}
            {latestValue.toLocaleString("de-DE", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            change >= 0
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </div>
      </div>

      <div className="relative h-40">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {/* GEÄNDERT: Feinere Grid-Linien */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="5"
              y1={y}
              x2="95"
              y2={y}
              stroke="#1f2937"
              strokeWidth="0.4"
            />
          ))}

          {/* Area fill */}
          {points && (
            <polygon
              points={`5,95 ${points} 95,95`}
              fill={color + "20"}
            />
          )}

          {/* Line */}
          {points && (
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* Y-axis labels */}
        <div className="pointer-events-none absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] text-slate-500 -ml-1">
          <span>
            {valuePrefix}
            {maxValue.toLocaleString("de-DE", {
              maximumFractionDigits: 0,
            })}
          </span>
          <span>
            {valuePrefix}
            {minValue.toLocaleString("de-DE", {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>

      {/* X-axis labels */}
      {data.length > 0 && (
        <div className="mt-2 flex justify-between text-[11px] text-slate-500">
          <span>
            {format(new Date(data[0].date), "dd.MM", {
              locale: de,
            })}
          </span>
          <span>
            {format(new Date(data[data.length - 1].date), "dd.MM", {
              locale: de,
            })}
          </span>
        </div>
      )}
    </div>
  );
}