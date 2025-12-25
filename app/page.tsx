"use client";

import { useState, useEffect } from "react";
import { getDefaultDateRange, getFilteredData } from "@/lib/mockData";
import { DateRange } from "@/lib/types";
import { DateRangePicker } from "@/components/DateRangePicker";
import { KpiCard } from "@/components/KpiCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";

export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [dashboardData, setDashboardData] = useState(() => getFilteredData(getDefaultDateRange()));

  useEffect(() => {
    setDashboardData(getFilteredData(dateRange));
  }, [dateRange]);

  return (
    <main className="p-8 space-y-6">
      <section>
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.kpis.map((kpi) => (
            <KpiCard key={kpi.id} data={kpi} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard title="Verlauf" data={dashboardData.lineChartData} />
        <BarChartCard title="Umsatzverteilung" data={dashboardData.barChartData} />
      </section>
    </main>
  );
}