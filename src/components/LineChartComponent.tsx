import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartComponentProps } from '../types/chart';

const LineChartComponent: React.FC<ChartComponentProps> = ({ data, dataKey, title }) => {
  return (
    <div className="h-full">
      {/* Modern Chart Title */}
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
            {title}
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
        </div>
      )}
      
      {/* Chart Container */}
      <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="#e2e8f0" 
              strokeOpacity={0.4}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
              cursor={{ stroke: '#10b981', strokeWidth: 2, strokeOpacity: 0.3 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ fill: '#10b981', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: '#10b981', 
                stroke: '#ffffff', 
                strokeWidth: 3,
                drop: true
              }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;