import { ChartWrapper } from "./ChartWrapper";

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: PieDataPoint[];
}

export function PieChartCard({ title, subtitle, data }: PieChartCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let currentAngle = -90;

  const segments = data.map((d) => {
    const percentage = (d.value / total) * 100;
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathD = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...d, percentage, pathD };
  });

  const totalValue = data.reduce((s, d) => s + d.value, 0);

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div className="h-full flex items-center gap-6">
        {/* Pie Chart */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-0">
            {segments.map((segment, i) => (
              <path
                key={i}
                d={segment.pathD}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${segment.name}: ${segment.percentage.toFixed(1)}%`}</title>
              </path>
            ))}
            {/* GEÄNDERT: Donut-Center auf Slate-Theme */}
            <circle cx="50" cy="50" r="25" fill="#0f172a" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-100">
                {totalValue.toLocaleString()}
              </div>
              {/* GEÄNDERT: Center-Label-Farbe auf Slate-Theme */}
              <div className="text-xs text-slate-400">Gesamt</div>
            </div>
          </div>
        </div>

        {/* GEÄNDERT: Legend-Farben auf Slate-Theme */}
        <div className="flex-1 space-y-2">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-slate-200">{segment.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-100">
                  {segment.percentage.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  ({segment.value.toLocaleString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
}