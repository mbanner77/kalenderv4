import { ChartWrapper } from "./ChartWrapper";

interface DataPoint {
  [key: string]: string | number;
}

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKey: string;
  xAxisKey: string;
  color: string;
  formatValue?: (value: number) => string;
}

export function LineChartCard({ title, subtitle, data, dataKey, xAxisKey, color, formatValue = (v) => String(v) }: LineChartCardProps) {
  const values = data.map((d) => Number(d[dataKey]));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div className="relative h-full">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue(Math.round((maxValue + minValue) / 2))}</span>
          <span>{formatValue(minValue)}</span>
        </div>

        {/* Chart Area */}
        <div className="ml-16 h-full pb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="#374151" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="0.5" />
            <line x1="0" y1="90" x2="100" y2="90" stroke="#374151" strokeWidth="0.5" />

            {/* Area Fill */}
            <polygon points={areaPoints} fill={`${color}20`} />

            {/* Line */}
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />

            {/* Data Points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 80 - 10;
              return (
                <circle key={i} cx={x} cy={y} r="1.5" fill={color} className="hover:r-3 transition-all">
                  <title>{`${d[xAxisKey]}: ${formatValue(Number(d[dataKey]))}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
              <span key={i}>{String(d[xAxisKey])}</span>
            ))}
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}