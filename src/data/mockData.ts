import { ChartDataPoint } from '../types/chart';

// Mock data for charts
export const salesData: ChartDataPoint[] = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
];

export const userData: ChartDataPoint[] = [
  { name: 'Jan', users: 1200 },
  { name: 'Feb', users: 1900 },
  { name: 'Mar', users: 1500 },
  { name: 'Apr', users: 2100 },
  { name: 'May', users: 1800 },
  { name: 'Jun', users: 2200 },
  { name: 'Jul', users: 2500 },
];

export const productData: ChartDataPoint[] = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
  { name: 'Product E', value: 278 },
  { name: 'Product F', value: 189 },
];

// Mock data for table
export const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
];

// Mock data for cards
export const cardData = [
  { title: 'Total Revenue', value: '$45,231.89', description: '+20.1% from last month', trend: 'up', trendValue: '20.1%' },
  { title: 'Subscriptions', value: '+2350', description: '+180.1% from last month', trend: 'up', trendValue: '180.1%' },
  { title: 'Sales', value: '+12,234', description: '+19% from last month', trend: 'up', trendValue: '19%' },
  { title: 'Active Now', value: '+573', description: '+201 since last hour', trend: 'up', trendValue: '201' },
];