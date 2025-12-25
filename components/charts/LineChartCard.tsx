import React from "react";
import { ChartData } from "@/lib/types";

interface LineChartCardProps {
  title: string;
  data: ChartData[];
  height?: number;
}

export function LineChartCard({
  title,
  data,
  height = 300,
}: LineChartCardProps) {
  const hasSeries = data.length > 0;
  const hasPoints = data.some((series) => series.data.length > 0);

  if (!hasSeries || !hasPoints) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-slate-500">
          Keine Daten verfügbar
        </div>
      </div>
    );
  }

  const allValues = data.flatMap((d) => d.data.map((p) => p.value));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = 600;
  const chartHeight = height;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const generatePath = (points: { date: string; value: number }[]): string => {
    if (points.length === 0) return "";
    const pathPoints = points.map((point, index) => {
      const x = padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
      const y =
        padding.top +
        plotHeight -
        ((point.value - minValue) / valueRange) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    });
    return pathPoints.join(" ");
  };

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + (valueRange * (4 - i)) / 4;
    return {
      value: Math.round(value),
      y: padding.top + (plotHeight * i) / 4,
    };
  });

  // X-Achse anhand der ersten Serie mit Daten
  const baseSeries =
    data.find((series) => series.data.length > 0) ?? data[0];

  const xLabels = baseSeries.data
    .filter((_, i, arr) => {
      const step = Math.max(1, Math.ceil(arr.length / 6));
      return i % step === 0 || i === arr.length - 1;
    })
    .map((point, index, arr) => ({
      label: new Date(point.date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }),
      x:
        padding.left +
        (index / Math.max(1, arr.length - 1)) * plotWidth,
    }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-4">
          {data.map((series) => (
            <div key={series.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: series.color }}
              />
              <span className="text-sm text-slate-400">
                {series.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[400px]"
          style={{ height: `${height}px` }}
        >
          {yLabels.map((label, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={label.y}
              x2={chartWidth - padding.right}
              y2={label.y}
              stroke="#334155"
              strokeDasharray="4 4"
            />
          ))}

          {yLabels.map((label, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={label.y + 4}
              textAnchor="end"
              className="text-xs fill-slate-500"
            >
              {label.value.toLocaleString("de-DE")}
            </text>
          ))}

          {xLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs fill-slate-500"
            >
              {label.label}
            </text>
          ))}

          {data.map((series) => (
            <g key={series.name}>
              <path
                d={`${generatePath(series.data)} L ${
                  padding.left + plotWidth
                } ${padding.top + plotHeight} L ${
                  padding.left
                } ${padding.top + plotHeight} Z`}
                fill={series.color}
                fillOpacity={0.1}
              />
              <path
                d={generatePath(series.data)}
                fill="none"
                stroke={series.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}