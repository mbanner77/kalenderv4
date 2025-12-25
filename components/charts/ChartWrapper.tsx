interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartWrapper({ title, subtitle, children }: ChartWrapperProps) {
  return (
    // GEÄNDERT: Styles an Slate-Theme angepasst
    <div className="bg-slate-900/60 backdrop-blur rounded-xl p-4 lg:p-6 border border-slate-800">
      <div className="mb-4">
        <h3 className="text-sm lg:text-base font-semibold text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs lg:text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}