interface KpiCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: number;
  color: "emerald" | "blue" | "purple" | "amber" | "rose";
}

const colorClasses = {
  emerald:
    "from-emerald-500/20 via-emerald-500/5 to-slate-900/40 border-emerald-500/30",
  blue: "from-blue-500/20 via-blue-500/5 to-slate-900/40 border-blue-500/30",
  purple:
    "from-purple-500/20 via-purple-500/5 to-slate-900/40 border-purple-500/30",
  amber:
    "from-amber-500/20 via-amber-500/5 to-slate-900/40 border-amber-500/30",
  rose: "from-rose-500/20 via-rose-500/5 to-slate-900/40 border-rose-500/30",
}; // GEÄNDERT: Verfeinerte Farbverläufe

const iconBgClasses = {
  emerald: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40",
  blue: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40",
  purple: "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40",
  amber: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40",
  rose: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40",
}; // GEÄNDERT: Icon-Hintergründe mit Ring

export function KpiCard({
  title,
  value,
  icon,
  trend,
  color,
}: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-5 shadow-lg shadow-slate-950/60 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1`} // GEÄNDERT: Glas-Effekt, Schatten & Hover
    >
      {/* GEÄNDERT: Feine Glanzlinie oben */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-40" />
      {/* GEÄNDERT: Weicher Glow-Halo im Hintergrund */}
      <div className="pointer-events-none absolute -right-6 top-6 h-24 w-24 rounded-full bg-white/5 blur-3xl" />

      <div className="mb-3 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBgClasses[color]} bg-opacity-70 shadow-inner`}
        >
          <span className="text-xl">{icon}</span>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              trend >= 0
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40"
            }`}
          >
            <span>{trend >= 0 ? "▲" : "▼"}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mb-1 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </div>
    </div>
  );
}