interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: number;
  color: "emerald" | "blue" | "purple" | "amber" | "rose";
}

const colorClasses = {
  emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
  blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
  amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
  rose: "from-rose-500/20 to-rose-600/5 border-rose-500/30",
};

const iconBgClasses = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  purple: "bg-purple-500/20 text-purple-400",
  amber: "bg-amber-500/20 text-amber-400",
  rose: "bg-rose-500/20 text-rose-400",
};

export function KpiCard({ title, value, icon, trend, color }: KpiCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-xl p-5 border transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${iconBgClasses[color]} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}>
            <span>{trend >= 0 ? "↑" : "↓"}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  );
}