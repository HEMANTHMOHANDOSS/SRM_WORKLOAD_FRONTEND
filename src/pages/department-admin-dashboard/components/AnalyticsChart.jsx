import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsChart = () => {
  const [activeChart, setActiveChart] = useState('workload');
  const [timeframe, setTimeframe] = useState('week');

  const workloadData = [
    { subject: 'Data Structures', hours: 18, maxHours: 20, staff: 'Dr. Johnson' },
    { subject: 'Algorithms', hours: 22, maxHours: 20, staff: 'Prof. Chen' },
    { subject: 'Database Systems', hours: 16, maxHours: 20, staff: 'Dr. Rodriguez' },
    { subject: 'Web Development', hours: 19, maxHours: 20, staff: 'Prof. Kim' },
    { subject: 'Machine Learning', hours: 15, maxHours: 20, staff: 'Dr. Wang' },
    { subject: 'Networks', hours: 21, maxHours: 20, staff: 'Prof. Lee' }
  ];

  const lectureDistribution = [
    { name: 'Core Subjects', value: 45, color: '#1E3A8A' },
    { name: 'Electives', value: 25, color: '#F59E0B' },
    { name: 'Lab Sessions', value: 20, color: '#10B981' },
    { name: 'Tutorials', value: 10, color: '#EF4444' }
  ];

  const weeklyTrends = [
    { week: 'Week 1', submissions: 12, completions: 8, conflicts: 2 },
    { week: 'Week 2', submissions: 18, completions: 15, conflicts: 1 },
    { week: 'Week 3', submissions: 22, completions: 19, conflicts: 3 },
    { week: 'Week 4', submissions: 16, completions: 14, conflicts: 0 },
    { week: 'Week 5', submissions: 25, completions: 22, conflicts: 2 }
  ];

  const chartOptions = [
    { value: 'workload', label: 'Workload Distribution', icon: 'BarChart3' },
    { value: 'lectures', label: 'Lecture Distribution', icon: 'PieChart' },
    { value: 'trends', label: 'Weekly Trends', icon: 'TrendingUp' }
  ];

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-floating">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {activeChart === 'workload' && entry.dataKey === 'hours' && ' hours'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'workload':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="subject" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maxHours" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'lectures':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lectureDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {lectureDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="submissions" stroke="#1E3A8A" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="conflicts" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderLegend = () => {
    switch (activeChart) {
      case 'workload':
        return (
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-sm" />
              <span className="text-sm text-muted-foreground">Current Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted rounded-sm" />
              <span className="text-sm text-muted-foreground">Max Hours</span>
            </div>
          </div>
        );

      case 'lectures':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {lectureDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        );

      case 'trends':
        return (
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-sm" />
              <span className="text-sm text-muted-foreground">Submissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-sm" />
              <span className="text-sm text-muted-foreground">Completions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-sm" />
              <span className="text-sm text-muted-foreground">Conflicts</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getInsights = () => {
    switch (activeChart) {
      case 'workload':
        return [
          { icon: 'AlertTriangle', text: '2 staff members are overloaded', color: 'text-warning' },
          { icon: 'TrendingUp', text: 'Average workload: 18.5 hours', color: 'text-primary' },
          { icon: 'Users', text: '6 active faculty members', color: 'text-success' }
        ];

      case 'lectures':
        return [
          { icon: 'BookOpen', text: 'Core subjects dominate (45%)', color: 'text-primary' },
          { icon: 'FlaskConical', text: 'Lab sessions well balanced (20%)', color: 'text-success' },
          { icon: 'GraduationCap', text: 'Electives need attention (25%)', color: 'text-warning' }
        ];

      case 'trends':
        return [
          { icon: 'TrendingUp', text: 'Submissions increased 25%', color: 'text-success' },
          { icon: 'CheckCircle', text: '88% completion rate', color: 'text-success' },
          { icon: 'AlertCircle', text: 'Conflicts reduced by 50%', color: 'text-primary' }
        ];

      default:
        return [];
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
        <div className="flex items-center space-x-2">
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="w-32"
          />
          <Button variant="ghost" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center space-x-2 mb-6 p-1 bg-muted rounded-lg">
        {chartOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveChart(option.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
              activeChart === option.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
            }`}
          >
            <Icon name={option.icon} size={16} />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
        {renderLegend()}
      </div>

      {/* Insights */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Key Insights</h4>
        <div className="space-y-2">
          {getInsights().map((insight, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name={insight.icon} size={14} className={insight.color} />
              <span className="text-sm text-muted-foreground">{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" iconName="RefreshCw">
          Refresh Data
        </Button>
        <Button variant="outline" size="sm" iconName="Settings">
          Configure
        </Button>
        <Button variant="outline" size="sm" iconName="Share">
          Share Report
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsChart;