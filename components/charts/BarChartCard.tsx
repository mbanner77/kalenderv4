import { ChartWrapper } from "./ChartWrapper";

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKey: string;
  xAxisKey: string;
  color: string;
  horizontal?: boolean;
  formatValue?: (value: number) => string;
}

export function BarChartCard({ title, subtitle, data, dataKey, xAxisKey, color, horizontal = false, formatValue = (v) => String(v) }: BarChartCardProps) {
  const values = data.map((d) => Number(d[dataKey]));
  const maxValue = Math.max(...values) || 1;

  if (horizontal) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        <div className="h-full flex flex-col justify-between">
          {data.map((d, i) => {
            const percentage = (Number(d[dataKey]) / maxValue) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24 truncate">{String(d[xAxisKey])}</span>
                <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-xs text-gray-300 w-20 text-right">{formatValue(Number(d[dataKey]))}</span>
              </div>
            );
          })}
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end justify-around gap-2">
          {data.map((d, i) => {
            const percentage = (Number(d[dataKey]) / maxValue) * 100;
            return (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-8 sm:w-12 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${percentage * 2}px`, backgroundColor: color, minHeight: "8px" }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap">
                      {formatValue(Number(d[dataKey]))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-around mt-3 border-t border-gray-700 pt-3">
          {data.map((d, i) => (
            <span key={i} className="text-xs text-gray-400 text-center flex-1 truncate px-1">
              {String(d[xAxisKey])}
            </span>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
}