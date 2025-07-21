import React from 'react';
import Icon from '../../../components/AppIcon';

const StaffStatistics = ({ stats }) => {
  const statisticsCards = [
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      change: stats.staffChange,
      changeType: stats.staffChange >= 0 ? 'increase' : 'decrease',
      icon: 'Users',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      change: stats.activeChange,
      changeType: stats.activeChange >= 0 ? 'increase' : 'decrease',
      icon: 'UserCheck',
      color: 'bg-success/10 text-success'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: stats.pendingChange,
      changeType: stats.pendingChange >= 0 ? 'increase' : 'decrease',
      icon: 'Clock',
      color: 'bg-warning/10 text-warning'
    },
    {
      title: 'This Month',
      value: stats.monthlyRegistrations,
      change: stats.monthlyChange,
      changeType: stats.monthlyChange >= 0 ? 'increase' : 'decrease',
      icon: 'UserPlus',
      color: 'bg-accent/10 text-accent'
    }
  ];

  const workloadDistribution = [
    { status: 'Under-loaded', count: stats.underLoaded, color: 'bg-warning' },
    { status: 'Optimal', count: stats.optimal, color: 'bg-success' },
    { status: 'Over-loaded', count: stats.overLoaded, color: 'bg-error' }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticsCards.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                {stat.change !== undefined && (
                  <div className="flex items-center mt-2">
                    <Icon 
                      name={stat.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                      size={14} 
                      className={stat.changeType === 'increase' ? 'text-success' : 'text-error'} 
                    />
                    <span className={`text-xs ml-1 ${
                      stat.changeType === 'increase' ? 'text-success' : 'text-error'
                    }`}>
                      {Math.abs(stat.change)}% from last month
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon name={stat.icon} size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workload Distribution */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Workload Distribution
        </h3>
        
        <div className="space-y-3">
          {workloadDistribution.map((item, index) => {
            const percentage = stats.totalStaff > 0 ? (item.count / stats.totalStaff) * 100 : 0;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-foreground">{item.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Building2" size={20} className="mr-2" />
          Department Breakdown
        </h3>
        
        <div className="space-y-3">
          {stats.departmentBreakdown.map((dept, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <Icon name="Users" size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.activeStaff} active</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{dept.totalStaff}</p>
                <p className="text-xs text-muted-foreground">
                  {dept.pendingApprovals} pending
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 py-2">
              <div className={`p-1.5 rounded-full ${
                activity.type === 'registration' ? 'bg-success/10' :
                activity.type === 'approval' ? 'bg-primary/10' :
                activity.type === 'update' ? 'bg-warning/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={
                    activity.type === 'registration' ? 'UserPlus' :
                    activity.type === 'approval' ? 'Check' :
                    activity.type === 'update' ? 'Edit' : 'Activity'
                  } 
                  size={12} 
                  className={
                    activity.type === 'registration' ? 'text-success' :
                    activity.type === 'approval' ? 'text-primary' :
                    activity.type === 'update' ? 'text-warning' : 'text-muted-foreground'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffStatistics;