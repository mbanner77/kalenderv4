import React from "react";

interface BarChartCardProps {
  title: string;
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export function BarChartCard({ title, data, height = 300 }: BarChartCardProps) {
  if (!data.length) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-slate-500">Keine Daten verfügbar</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value)) || 1;

  const padding = { top: 20, right: 20, bottom: 60, left: 80 };
  const chartWidth = 500;
  const chartHeight = height;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const barHeight = Math.min(40, (plotHeight - (data.length - 1) * 10) / data.length);
  const barGap = 10;

  const xLabels = Array.from({ length: 5 }, (_, i) => ({
    value: Math.round((maxValue * (i + 1)) / 5),
    x: padding.left + (plotWidth * (i + 1)) / 5,
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[300px]" style={{ height: `${height}px` }}>
          {xLabels.map((label, i) => (
            <line key={i} x1={label.x} y1={padding.top} x2={label.x} y2={chartHeight - padding.bottom} stroke="#334155" strokeDasharray="4 4" />
          ))}

          {xLabels.map((label, i) => (
            <text key={i} x={label.x} y={chartHeight - padding.bottom + 20} textAnchor="middle" className="text-xs fill-slate-500">
              {(label.value / 1000).toFixed(0)}k €
            </text>
          ))}

          {data.map((item, index) => {
            const barWidth = (item.value / maxValue) * plotWidth;
            const y = padding.top + index * (barHeight + barGap);

            return (
              <g key={item.name}>
                <text x={padding.left - 10} y={y + barHeight / 2 + 4} textAnchor="end" className="text-xs fill-slate-400">
                  {item.name}
                </text>

                <rect x={padding.left} y={y} width={plotWidth} height={barHeight} fill="#1e293b" rx={4} />

                <rect x={padding.left} y={y} width={barWidth} height={barHeight} fill={item.color} rx={4} className="transition-all duration-500" />

                <text x={padding.left + barWidth + 8} y={y + barHeight / 2 + 4} className="text-xs fill-slate-300 font-medium">
                  {(item.value / 1000).toFixed(1)}k €
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}