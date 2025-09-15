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
    <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{title}</h3>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </p>
        {description && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              trend === 'up' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {trend === 'up' ? '↗' : '↘'}
            </div>
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendValue}
            </span>
          </div>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default CardComponent;