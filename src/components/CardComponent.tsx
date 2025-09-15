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
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl"></div>
      
      {/* Card content */}
      <div className="relative p-8 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{title}</h3>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Value */}
        <div className="mb-6">
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
          )}
        </div>
        
        {/* Trend indicator */}
        {trend && trendValue && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
                trend === 'up' 
                  ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-600' 
                  : 'bg-gradient-to-r from-red-100 to-red-50 text-red-600'
              }`}>
                {trend === 'up' ? '↗' : '↘'}
              </div>
              <span className={`text-sm font-semibold ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendValue}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">vs last period</span>
          </div>
        )}
        
        {/* Subtle decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      </div>
    </div>
  );
};

export default CardComponent;