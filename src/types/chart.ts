export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ChartComponentProps {
  data: ChartDataPoint[];
  dataKey: string;
  title?: string;
}