import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const SystemAnalytics = ({ analyticsData }) => {
  const [activeTab, setActiveTab] = useState('workload');

  const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const tabs = [
    { id: 'workload', label: 'Workload Distribution', icon: 'BarChart3' },
    { id: 'departments', label: 'Department Status', icon: 'PieChart' },
    { id: 'trends', label: 'Usage Trends', icon: 'TrendingUp' }
  ];

  const renderWorkloadChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={analyticsData.workloadData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="department" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-popover-foreground)'
            }}
          />
          <Bar dataKey="assigned" fill="#1E3A8A" name="Assigned Hours" />
          <Bar dataKey="capacity" fill="#10B981" name="Total Capacity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderDepartmentChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={analyticsData.departmentStatus}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {analyticsData.departmentStatus.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-popover-foreground)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTrendsChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={analyticsData.usageTrends}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-popover-foreground)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="activeUsers" 
            stroke="#1E3A8A" 
            strokeWidth={2}
            name="Active Users"
          />
          <Line 
            type="monotone" 
            dataKey="timetablesGenerated" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Timetables Generated"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderChart = () => {
    switch (activeTab) {
      case 'workload':
        return renderWorkloadChart();
      case 'departments':
        return renderDepartmentChart();
      case 'trends':
        return renderTrendsChart();
      default:
        return renderWorkloadChart();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">System Analytics</h2>
            <p className="text-sm text-muted-foreground">Real-time insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth">
              <Icon name="Download" size={16} />
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {renderChart()}
      </div>

      {/* Summary Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{analyticsData.totalHours}</div>
            <div className="text-xs text-muted-foreground">Total Hours Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{analyticsData.efficiency}%</div>
            <div className="text-xs text-muted-foreground">System Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{analyticsData.conflicts}</div>
            <div className="text-xs text-muted-foreground">Active Conflicts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{analyticsData.satisfaction}%</div>
            <div className="text-xs text-muted-foreground">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;