import React from 'react';
import Icon from '../../../components/AppIcon';

const DepartmentStatsCard = ({ title, value, icon, trend, trendValue, color = 'primary', onClick }) => {
  const getColorClasses = () => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div 
      className={`p-6 rounded-lg border bg-card hover:shadow-elevated transition-smooth cursor-pointer ${onClick ? 'hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default DepartmentStatsCard;