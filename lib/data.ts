import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";

export interface MetricData {
  date: string;
  revenue: number;
  users: number;
  orders: number;
  conversionRate: number;
  category: string;
  source: string;
}

const categories = ["Elektronik", "Kleidung", "Haushalt", "Sport", "Bücher"];
const sources = ["Organisch", "Bezahlt", "Social Media", "E-Mail", "Direkt"];

export function generateMockData(): MetricData[] {
  const data: MetricData[] = [];
  const today = new Date();
  
  // Generate 365 days of data
  for (let i = 365; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Add some seasonality and randomness
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    const monthFactor = 1 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.3;
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const baseRevenue = 5000 * weekendFactor * monthFactor * randomFactor;
    const baseUsers = 500 * weekendFactor * monthFactor * randomFactor;
    const baseOrders = 50 * weekendFactor * monthFactor * randomFactor;
    
    // Create entries for each category
    categories.forEach((category, catIndex) => {
      const categoryFactor = 0.5 + (catIndex / categories.length) * 0.5 + Math.random() * 0.3;
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      data.push({
        date: dateStr,
        revenue: Math.round(baseRevenue * categoryFactor * 100) / 100,
        users: Math.round(baseUsers * categoryFactor),
        orders: Math.round(baseOrders * categoryFactor),
        conversionRate: Math.round((2 + Math.random() * 4) * 100) / 100,
        category,
        source,
      });
    });
  }
  
  return data;
}

export function filterDataByDateRange(
  data: MetricData[],
  startDate: Date,
  endDate: Date
): MetricData[] {
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return isWithinInterval(itemDate, {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    });
  });
}

export function aggregateByCategory(data: MetricData[]): { name: string; value: number }[] {
  const categoryMap = new Map<string, number>();
  
  data.forEach((item) => {
    const current = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, current + item.revenue);
  });
  
  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

export function aggregateBySource(data: MetricData[]): { name: string; value: number }[] {
  const sourceMap = new Map<string, number>();
  
  data.forEach((item) => {
    const current = sourceMap.get(item.source) || 0;
    sourceMap.set(item.source, current + item.users);
  });
  
  return Array.from(sourceMap.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}