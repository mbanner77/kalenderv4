export type DateRangeType = "today" | "last7days" | "last30days" | "last90days" | "thisYear";

export interface RevenuePoint {
  date: string;
  value: number;
}

export interface CategoryPoint {
  category: string;
  value: number;
}

export interface TrafficPoint {
  name: string;
  value: number;
  color: string;
}

export interface ProductPoint {
  name: string;
  sales: number;
}

export interface FilteredData {
  revenueOverTime: RevenuePoint[];
  categoryBreakdown: CategoryPoint[];
  trafficSources: TrafficPoint[];
  topProducts: ProductPoint[];
}

export interface KpiData {
  revenue: { value: number; change: number };
  users: { value: number; change: number };
  orders: { value: number; change: number };
  conversion: { value: number; change: number };
}

// Seed für konsistente Pseudo-Zufallszahlen
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function getFilteredData(range: DateRangeType): FilteredData {
  const days = range === "today" ? 1 
    : range === "last7days" ? 7 
    : range === "last30days" ? 30 
    : range === "last90days" ? 90 
    : 365;
  
  const random = seededRandom(days);
  const dataPoints = Math.min(days, 30);
  
  const revenueOverTime: RevenuePoint[] = Array.from({ length: dataPoints }).map((_, i) => ({
    date: `Tag ${i + 1}`,
    value: Math.round(random() * 800 + 200)
  }));

  const categoryBreakdown: CategoryPoint[] = [
    { category: "Elektronik", value: Math.round(random() * 500 + 800) },
    { category: "Kleidung", value: Math.round(random() * 400 + 500) },
    { category: "Haushalt", value: Math.round(random() * 300 + 300) },
    { category: "Sport", value: Math.round(random() * 200 + 200) },
  ];

  const trafficSources: TrafficPoint[] = [
    { name: "Direkt", value: Math.round(random() * 200 + 350), color: "#6366f1" },
    { name: "Suche", value: Math.round(random() * 150 + 250), color: "#10b981" },
    { name: "Social", value: Math.round(random() * 100 + 100), color: "#f59e0b" },
    { name: "Referral", value: Math.round(random() * 80 + 50), color: "#ec4899" },
  ];

  const topProducts: ProductPoint[] = [
    { name: "Laptop Pro", sales: Math.round(random() * 50 + 100) },
    { name: "Wireless Kopfhörer", sales: Math.round(random() * 40 + 80) },
    { name: "Smart Watch", sales: Math.round(random() * 30 + 50) },
    { name: "Tablet Air", sales: Math.round(random() * 25 + 40) },
    { name: "USB-C Hub", sales: Math.round(random() * 20 + 30) },
  ];

  return { revenueOverTime, categoryBreakdown, trafficSources, topProducts };
}

export function getKpiData(range: DateRangeType): KpiData {
  const multiplier = range === "today" ? 0.03 
    : range === "last7days" ? 0.2 
    : range === "last30days" ? 1 
    : range === "last90days" ? 3 
    : 12;

  return {
    revenue: { 
      value: Math.round(123456 * multiplier), 
      change: range === "today" ? 12 : range === "last7days" ? 8 : 5 
    },
    users: { 
      value: Math.round(9876 * multiplier), 
      change: range === "today" ? -2 : range === "last7days" ? 3 : -1 
    },
    orders: { 
      value: Math.round(2345 * multiplier), 
      change: range === "today" ? 15 : range === "last7days" ? 7 : 4 
    },
    conversion: { 
      value: 2.3 + (range === "today" ? 0.5 : range === "last7days" ? 0.2 : 0), 
      change: range === "today" ? 0.8 : range === "last7days" ? 0.3 : 0.1 
    },
  };
}