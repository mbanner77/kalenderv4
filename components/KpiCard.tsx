interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: "indigo" | "green" | "amber" | "rose";
}

const colorClasses = {
  indigo: "bg-indigo-500/10 text-indigo-400",
  green: "bg-emerald-500/10 text-emerald-400",
  amber: "bg-amber-500/10 text-amber-400",
  rose: "bg-rose-500/10 text-rose-400",
};

export function KpiCard({ title, value, change, changeLabel, icon, color }: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
          <svg className={`w-4 h-4 ${isPositive ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-gray-500 text-xs mt-1">{changeLabel}</p>
      </div>
    </div>
  );
}