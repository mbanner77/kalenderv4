interface PieData {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  data: PieData[];
}

const pieColors = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

export function PieChartCard({ title, data }: PieChartCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate pie segments
  let currentAngle = -90; // Start from top
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    // Calculate SVG arc path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    return {
      ...item,
      percentage,
      path,
      color: pieColors[index % pieColors.length],
    };
  });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="w-40 h-40 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-0">
            {segments.map((segment, index) => (
              <path
                key={segment.name}
                d={segment.path}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80"
                style={{ transformOrigin: "center" }}
              />
            ))}
            {/* Center circle for donut effect */}
            <circle cx="50" cy="50" r="25" fill="#1e293b" />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-xs font-bold"
            >
              {total.toLocaleString("de-DE")}
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment) => (
            <div key={segment.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-slate-300 flex-1">{segment.name}</span>
              <span className="text-sm font-medium text-white">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}