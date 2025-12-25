"use client";

import { useState, useMemo } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { KpiCard } from "@/components/KpiCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import { generateMockData, filterDataByDateRange, aggregateByCategory, aggregateBySource } from "@/lib/data";
import { subDays, startOfDay } from "date-fns";

export default function Page() {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  const allData = useMemo(() => generateMockData(), []);
  
  const filteredData = useMemo(
    () => filterDataByDateRange(allData, dateRange.start, dateRange.end),
    [allData, dateRange]
  );

  const kpis = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
    const totalUsers = filteredData.reduce((sum, d) => sum + d.users, 0);
    const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);
    const avgConversion = filteredData.length > 0
      ? filteredData.reduce((sum, d) => sum + d.conversionRate, 0) / filteredData.length
      : 0;
    
    return { totalRevenue, totalUsers, totalOrders, avgConversion };
  }, [filteredData]);

  const categoryData = useMemo(() => aggregateByCategory(filteredData), [filteredData]);
  const sourceData = useMemo(() => aggregateBySource(filteredData), [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Analytics Dashboard</h1>
            <p className="text-slate-400">Übersicht Ihrer wichtigsten Kennzahlen</p>
          </div>
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(start, end) => setDateRange({ start, end })}
          />
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Gesamtumsatz"
          value={`€${kpis.totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
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
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChartCard
          title="Umsatzentwicklung"
          data={filteredData.map(d => ({
            date: d.date,
            value: d.revenue,
          }))}
          color="#10b981"
          valuePrefix="€"
        />
        <LineChartCard
          title="Benutzeraktivität"
          data={filteredData.map(d => ({
            date: d.date,
            value: d.users,
          }))}
          color="#3b82f6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Umsatz nach Kategorie"
          data={categoryData}
        />
        <PieChartCard
          title="Traffic-Quellen"
          data={sourceData}
        />
      </div>
    </div>
  );
}