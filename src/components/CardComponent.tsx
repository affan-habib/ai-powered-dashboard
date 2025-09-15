import React from 'react';

interface CardComponentProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  title, 
  value, 
  description, 
  trend,
  trendValue 
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {trend && trendValue && (
        <div className="mt-2 flex items-center">
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default CardComponent;