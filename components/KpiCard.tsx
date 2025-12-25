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
    // GEÄNDERT: Kompaktere Karte
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-0.5 text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
          <svg className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-slate-400 text-xs font-medium">{title}</h3>
        <p className="text-xl font-bold text-slate-50 mt-0.5">{value}</p>
        <p className="text-slate-500 text-[10px] mt-0.5">{changeLabel}</p>
      </div>
    </div>
  );
}