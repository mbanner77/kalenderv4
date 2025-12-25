import { DashboardData, DateRange } from './types';

// Generate dates for the last N days
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Generate random data with trend
function generateTrendData(dates: string[], baseValue: number, volatility: number): { date: string; value: number }[] {
  let currentValue = baseValue;
  
  return dates.map(date => {
    const change = (Math.random() - 0.4) * volatility;
    currentValue = Math.max(0, currentValue + change);
    return {
      date,
      value: Math.round(currentValue)
    };
  });
}

// Full dataset for 90 days
const allDates = generateDates(90);

const fullRevenueData = generateTrendData(allDates, 50000, 5000);
const fullUsersData = generateTrendData(allDates, 1200, 150);
const fullOrdersData = generateTrendData(allDates, 300, 50);
const fullConversionData = generateTrendData(allDates, 35, 5);

export function getFilteredData(dateRange: DateRange): DashboardData {
  const startStr = dateRange.startDate.toISOString().split('T')[0];
  const endStr = dateRange.endDate.toISOString().split('T')[0];
  
  // Filter data by date range
  const filterByRange = (data: { date: string; value: number }[]) => {
    return data.filter(d => d.date >= startStr && d.date <= endStr);
  };
  
  const filteredRevenue = filterByRange(fullRevenueData);
  const filteredUsers = filterByRange(fullUsersData);
  const filteredOrders = filterByRange(fullOrdersData);
  const filteredConversion = filterByRange(fullConversionData);
  
  // Calculate KPIs
  const sumValues = (data: { value: number }[]) => data.reduce((sum, d) => sum + d.value, 0);
  const avgValues = (data: { value: number }[]) => data.length > 0 ? sumValues(data) / data.length : 0;
  
  // Get previous period for comparison
  const periodLength = filteredRevenue.length;
  const prevStartIndex = Math.max(0, fullRevenueData.findIndex(d => d.date === startStr) - periodLength);
  const prevEndIndex = prevStartIndex + periodLength;
  
  const prevRevenue = fullRevenueData.slice(prevStartIndex, prevEndIndex);
  const prevUsers = fullUsersData.slice(prevStartIndex, prevEndIndex);
  const prevOrders = fullOrdersData.slice(prevStartIndex, prevEndIndex);
  const prevConversion = fullConversionData.slice(prevStartIndex, prevEndIndex);
  
  // Bar chart data - aggregate by category
  const categories = ['Produkte', 'Services', 'Abonnements', 'Beratung', 'Support'];
  const barChartData = categories.map((name, index) => ({
    name,
    value: Math.round(sumValues(filteredRevenue) * (0.35 - index * 0.05) * (0.8 + Math.random() * 0.4)),
    color: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index]
  }));
  
  // Pie chart data - traffic sources
  const pieChartData = [
    { name: 'Organisch', value: 35 + Math.round(Math.random() * 10), color: '#6366f1' },
    { name: 'Direkt', value: 25 + Math.round(Math.random() * 10), color: '#22c55e' },
    { name: 'Social Media', value: 20 + Math.round(Math.random() * 5), color: '#f59e0b' },
    { name: 'Referral', value: 12 + Math.round(Math.random() * 5), color: '#ef4444' },
    { name: 'Email', value: 8 + Math.round(Math.random() * 5), color: '#8b5cf6' }
  ];
  
  return {
    kpis: [
      {
        id: 'revenue',
        title: 'Umsatz',
        value: sumValues(filteredRevenue),
        previousValue: sumValues(prevRevenue),
        format: 'currency',
        icon: 'revenue'
      },
      {
        id: 'users',
        title: 'Aktive Nutzer',
        value: Math.round(avgValues(filteredUsers)),
        previousValue: Math.round(avgValues(prevUsers)),
        format: 'number',
        icon: 'users'
      },
      {
        id: 'orders',
        title: 'Bestellungen',
        value: sumValues(filteredOrders),
        previousValue: sumValues(prevOrders),
        format: 'number',
        icon: 'orders'
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: avgValues(filteredConversion),
        previousValue: avgValues(prevConversion),
        format: 'percentage',
        icon: 'conversion'
      }
    ],
    lineChartData: [
      {
        name: 'Umsatz',
        data: filteredRevenue,
        color: '#6366f1'
      },
      {
        name: 'Nutzer',
        data: filteredUsers,
        color: '#22c55e'
      }
    ],
    barChartData,
    pieChartData
  };
}

export function getDefaultDateRange(): DateRange {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  return { startDate, endDate };
}