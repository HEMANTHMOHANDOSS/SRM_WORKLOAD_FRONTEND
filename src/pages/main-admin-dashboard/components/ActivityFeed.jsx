import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      'department-created': 'Building2',
      'staff-approved': 'UserCheck',
      'timetable-generated': 'Calendar',
      'system-alert': 'AlertTriangle',
      'credential-generated': 'Key',
      'form-submitted': 'FileText',
      'user-login': 'LogIn',
      'user-logout': 'LogOut'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'department-created': 'text-success',
      'staff-approved': 'text-success',
      'timetable-generated': 'text-primary',
      'system-alert': 'text-warning',
      'credential-generated': 'text-accent',
      'form-submitted': 'text-secondary',
      'user-login': 'text-muted-foreground',
      'user-logout': 'text-muted-foreground'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
            View All
          </button>
        </div>
      </div>

      <div className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                  <Icon name={getActivityIcon(activity.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  
                  {activity.user && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon name="User" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <h4 className="text-sm font-medium text-foreground mb-2">No recent activity</h4>
            <p className="text-xs text-muted-foreground">
              System activities will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;