export interface KpiData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  format: 'number' | 'currency' | 'percentage';
  icon: 'users' | 'revenue' | 'conversion' | 'orders';
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartData {
  name: string;
  data: TimeSeriesDataPoint[];
  color: string;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DashboardData {
  kpis: KpiData[];
  lineChartData: ChartData[];
  barChartData: { name: string; value: number; color: string }[];
  pieChartData: PieDataPoint[];
}