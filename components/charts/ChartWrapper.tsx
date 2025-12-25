interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartWrapper({ title, subtitle, children }: ChartWrapperProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}