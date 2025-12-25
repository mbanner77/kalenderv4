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

export function LineChartCard({ title, data, color, valuePrefix = "" }: LineChartCardProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (data.length === 0) return { points: "", maxValue: 0, minValue: 0 };
    
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const width = 100;
    const height = 100;
    const padding = 5;
    
    const pts = data.map((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
      const y = height - padding - ((d.value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(" ");
    
    return { points: pts, maxValue: max, minValue: min };
  }, [data]);

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const firstValue = data.length > 0 ? data[0].value : 0;
  const change = firstValue > 0 ? ((latestValue - firstValue) / firstValue) * 100 : 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-2xl font-bold text-white mt-1">
            {valuePrefix}{latestValue.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
          change >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
        }`}>
          {change >= 0 ? "+" : ""}{change.toFixed(1)}%
        </div>
      </div>
      
      <div className="h-40 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="5"
              y1={y}
              x2="95"
              y2={y}
              stroke="#334155"
              strokeWidth="0.3"
            />
          ))}
          
          {/* Area fill */}
          {points && (
            <polygon
              points={`5,95 ${points} 95,95`}
              fill={`${color}20`}
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
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 -ml-1">
          <span>{valuePrefix}{maxValue.toLocaleString("de-DE", { maximumFractionDigits: 0 })}</span>
          <span>{valuePrefix}{minValue.toLocaleString("de-DE", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      {data.length > 0 && (
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{format(new Date(data[0].date), "dd.MM", { locale: de })}</span>
          <span>{format(new Date(data[data.length - 1].date), "dd.MM", { locale: de })}</span>
        </div>
      )}
    </div>
  );
}