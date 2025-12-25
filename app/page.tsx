"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "@/components/DateRangePicker";
import { KpiGrid } from "@/components/KpiGrid";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import { getFilteredData, getKpiData } from "@/lib/data";

export default function Page() {
  const [dateRange, setDateRange] = useState({
    type: "last30days",
    label: "Letzte 30 Tage"
  });

  const filteredData = useMemo(() => getFilteredData(dateRange.type), [dateRange.type]);
  const kpiData = useMemo(() => getKpiData(dateRange.type), [dateRange.type]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-50">Analytics Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Echtzeit-Einblick in Umsatz, Nutzer und Performance
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live-Daten
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* KPI Cards */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-50 tracking-tight">
                    Übersicht Kennzahlen
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Echtzeit-Einblick in Umsatz, Nutzer und Performance
                  </p>
                </div>
              </div>
              <KpiGrid data={kpiData} />
            </section>

            {/* Charts Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-6">
              <LineChartCard
                title="Umsatz über Zeit"
                subtitle="Täglicher Umsatz im ausgewählten Zeitraum"
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
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] gap-6">
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
            </section>

            {/* Ziele & Performance */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Ziele & Performance
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Aktueller Fortschritt gegenüber den Quartalszielen
                    </p>
                  </div>
                  <span className="text-sm uppercase tracking-wide text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Stabil
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Umsatzziel Q2</span>
                      <span className="text-sm font-semibold text-slate-100">74%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full w-[74%] bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.55)]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Neukunden</span>
                      <span className="text-sm font-semibold text-slate-100">61%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full w-[61%] bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 font-medium">Wiederkehrende Käufer</span>
                      <span className="text-sm font-semibold text-slate-100">48%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full w-[48%] bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}