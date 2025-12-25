export type DateRangeType = "today" | "last7days" | "last30days" | "last90days" | "thisYear";

type RevenuePoint = { date: string; value: number };
type CategoryPoint = { category: string; value: number };
type TrafficPoint = { name: string; value: number; color: string };
type ProductPoint = { name: string; sales: number };

export function getFilteredData(range: DateRangeType) {
  // Simple mocked data generator depending on range; suitable for development/build
  const days = range === "today" ? 1 : range === "last7days" ? 7 : range === "last30days" ? 30 : range === "last90days" ? 90 : 365;
  const revenueOverTime: RevenuePoint[] = Array.from({ length: Math.min(days, 30) }).map((_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.round(Math.random() * 1000) + 200
  }));

  const categoryBreakdown: CategoryPoint[] = [    { category: "A", value: 1200 },
    { category: "B", value: 800 },
    { category: "C", value: 400 },
  ];

  const trafficSources: TrafficPoint[] = [    { name: "Direkt", value: 450, color: "#6366f1" },
    { name: "Suche", value: 300, color: "#10b981" },
    { name: "Social", value: 150, color: "#f59e0b" },
  ];

  const topProducts: ProductPoint[] = [    { name: "Produkt 1", sales: 120 },
    { name: "Produkt 2", sales: 95 },
    { name: "Produkt 3", sales: 60 },
  ];

  return { revenueOverTime, categoryBreakdown, trafficSources, topProducts };
}

export function getKpiData(range: DateRangeType) {
  // Mock KPIs; deterministic-ish values for build-time stability
  return {
    revenue: { value: 123456, change: 8 },
    users: { value: 9876, change: -3 },
    orders: { value: 2345, change: 5 },
    conversion: { value: 2.3, change: 0.2 },
  };
}