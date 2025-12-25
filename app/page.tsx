"use client";

import { useState, useMemo } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { KpiCard } from "@/components/KpiCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import {
  generateMockData,
  filterDataByDateRange,
  aggregateByCategory,
  aggregateBySource,
} from "@/lib/data";
import { subDays } from "date-fns"; // GEÄNDERT: Ungenutzte Imports entfernt

export default function Page() {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  const allData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(
    () =>
      filterDataByDateRange(allData, dateRange.start, dateRange.end),
    [allData, dateRange]
  );

  const kpis = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
    const totalUsers = filteredData.reduce((sum, d) => sum + d.users, 0);
    const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);
    const avgConversion =
      filteredData.length > 0
        ? filteredData.reduce((sum, d) => sum + d.conversionRate, 0) /
          filteredData.length
        : 0;

    return { totalRevenue, totalUsers, totalOrders, avgConversion };
  }, [filteredData]);

  const categoryData = useMemo(
    () => aggregateByCategory(filteredData),
    [filteredData]
  );
  const sourceData = useMemo(
    () => aggregateBySource(filteredData),
    [filteredData]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"> {/* GEÄNDERT: Vollflächiger, moderner Hintergrund */}
      {/* GEÄNDERT: Dekorative Glow-Elemente im Hintergrund */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 p-4 md:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8"> {/* GEÄNDERT: Zentrale, begrenzte Breite */}
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* GEÄNDERT: Titelbereich mit Icon-Badge und Meta-Infos */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 shadow-sm shadow-slate-900/60">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Live-Übersicht · Mock-Daten
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-900/40">
                  📊
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Analytics Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Kompakte Übersicht über Umsatz, Nutzeraktivität und
                    Performance Ihrer Kanäle.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md md:w-auto">
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={(start, end) => setDateRange({ start, end })}
              />
            </div>
          </header>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Gesamtumsatz"
              value={`€${kpis.totalRevenue.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}`}
              icon="💰"
              trend={12.5}
              color="emerald"
            />
            <KpiCard
              title="Benutzer"
              value={kpis.totalUsers.toLocaleString("de-DE")}
              icon="👥"
              trend={8.2}
              color="blue"
            />
            <KpiCard
              title="Bestellungen"
              value={kpis.totalOrders.toLocaleString("de-DE")}
              icon="📦"
              trend={-2.4}
              color="purple"
            />
            <KpiCard
              title="Conversion Rate"
              value={`${kpis.avgConversion.toFixed(2)}%`}
              icon="📈"
              trend={5.1}
              color="amber"
            />
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LineChartCard
              title="Umsatzentwicklung"
              data={filteredData.map((d) => ({
                date: d.date,
                value: d.revenue,
              }))}
              color="#10b981"
              valuePrefix="€"
            />
            <LineChartCard
              title="Benutzeraktivität"
              data={filteredData.map((d) => ({
                date: d.date,
                value: d.users,
              }))}
              color="#3b82f6"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChartCard
              title="Umsatz nach Kategorie"
              data={categoryData}
            />
            <PieChartCard
              title="Traffic-Quellen"
              data={sourceData}
            />
          </section>
        </div>
      </main>
    </div>
  );
}