import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartComponentProps } from '../types/chart';

const AreaChartComponent: React.FC<ChartComponentProps> = ({ data, dataKey, title }) => {
  return (
    <div className="h-full">
      {/* Modern Chart Title */}
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
            {title}
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      )}
      
      {/* Chart Container */}
      <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
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
              cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeOpacity: 0.3 }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="url(#areaStroke)"
              fill="url(#areaGradient)"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: '#8b5cf6', 
                stroke: '#ffffff', 
                strokeWidth: 3
              }}
            />
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;