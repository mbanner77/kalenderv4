interface BarData {
  name: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  data: BarData[];
}

const barColors = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

export function BarChartCard({ title, data }: BarChartCardProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const share = total > 0 ? (item.value / total) * 100 : 0;
          
          return (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="text-sm font-medium text-white">
                  €{item.value.toLocaleString("de-DE")} ({share.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColors[index % barColors.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Gesamt</span>
          <span className="text-lg font-bold text-white">
            €{total.toLocaleString("de-DE")}
          </span>
        </div>
      </div>
    </div>
  );
}