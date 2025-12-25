import { useState, useMemo } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { KpiGrid } from "@/components/KpiGrid";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import { getFilteredData, getKpiData, DateRangeType } from "@/lib/data";

export default function Page() {
  const [dateRange, setDateRange] = useState({
    type: "last30days" as DateRangeType,
    label: "Letzte 30 Tage"
  });
  // GEÄNDERT: Sidebar State hinzugefügt
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredData = useMemo(() => getFilteredData(dateRange.type), [dateRange.type]);
  const kpiData = useMemo(() => getKpiData(dateRange.type), [dateRange.type]);

  // GEÄNDERT: Navigation Items definiert
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: true },
    { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", active: false },
    { id: "reports", label: "Berichte", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", active: false },
    { id: "settings", label: "Einstellungen", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 text-sm">
      {/* GEÄNDERT: Komplett neues Layout mit Sidebar */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-56 xl:w-64 bg-slate-900 border-r border-slate-800">
          {/* Logo */}
          <div className="h-14 flex items-center px-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-base text-slate-100">Analytics</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-medium text-white">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              {/* Mobile Logo */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-base text-slate-100">Analytics</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      item.active 
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* GEÄNDERT: Kompakterer Header */}
          <header className="h-14 flex-shrink-0 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
            <div className="h-full px-4 flex items-center justify-between gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Title - Hidden on mobile */}
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold text-slate-100">Dashboard</h1>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-3 ml-auto">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                
                {/* Live Indicator */}
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>

                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Übersicht</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Echtzeit-Einblick in Ihre wichtigsten Kennzahlen
                  </p>
                </div>
              </div>

              {/* KPI Cards */}
              <KpiGrid data={kpiData} />

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <LineChartCard
                  title="Umsatz über Zeit"
                  subtitle="Täglicher Umsatz im Zeitraum"
                  data={filteredData.revenueOverTime}
                  dataKey="value"
                  xAxisKey="date"
                  color="#6366f1"
                  formatValue={(v) => `€${v.toLocaleString()}`}
                />
                <BarChartCard
                  title="Umsatz nach Kategorie"
                  subtitle="Verteilung nach Produktkategorien"
                  data={filteredData.categoryBreakdown}
                  dataKey="value"
                  xAxisKey="category"
                  color="#10b981"
                  formatValue={(v) => `€${v.toLocaleString()}`}
                />
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <PieChartCard
                  title="Traffic-Quellen"
                  subtitle="Besucherverteilung nach Herkunft"
                  data={filteredData.trafficSources}
                />
                <BarChartCard
                  title="Top Produkte"
                  subtitle="Meistverkaufte Produkte"
                  data={filteredData.topProducts}
                  dataKey="sales"
                  xAxisKey="name"
                  color="#f59e0b"
                  horizontal
                  formatValue={(v) => `${v} Stück`}
                />
              </div>

              {/* Goals Section - Kompakter */}
              <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">Ziele Q2</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Fortschritt gegenüber Quartalszielen</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Auf Kurs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Umsatzziel", value: 74, color: "from-violet-500 to-indigo-500" },
                    { label: "Neukunden", value: 61, color: "from-emerald-400 to-teal-500" },
                    { label: "Wiederkäufer", value: 48, color: "from-amber-400 to-orange-500" },
                  ].map((goal) => (
                    <div key={goal.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">{goal.label}</span>
                        <span className="text-xs font-medium text-slate-200">{goal.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                          style={{ width: `${goal.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}