"use client";

import { useState, useMemo } from "react";
import { DateRangePicker, DateRange } from "@/components/DateRangePicker";
import { KpiGrid } from "@/components/KpiGrid";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import { getFilteredData, getKpiData, DateRangeType } from "@/lib/data";

export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange>({
    type: "last30days",
    label: "Letzte 30 Tage"
  });

  const filteredData = useMemo(() => getFilteredData(dateRange.type), [dateRange.type]);
  const kpiData = useMemo(() => getKpiData(dateRange.type), [dateRange.type]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Übersicht Ihrer wichtigsten Kennzahlen</p>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <section className="mb-8">
          <KpiGrid data={kpiData} />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </main>
    </div>
  );
}