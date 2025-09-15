import { ColumnDef } from '@tanstack/react-table';

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ComponentData {
  id?: string;
  type: string;
  title: string;
  data: ChartDataPoint[];
 dataKey?: string;
  columns?: ColumnDef<any>[];
}