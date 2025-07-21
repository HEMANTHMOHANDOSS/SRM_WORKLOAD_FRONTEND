import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const WorkloadAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current'); // current, previous, yearly

  // Mock workload data
  const workloadData = {
    totalHours: 18,
    maxHours: 20,
    subjects: [
      { name: "Data Structures", hours: 6, type: "Core", students: 45 },
      { name: "Database Management", hours: 4, type: "Core", students: 38 },
      { name: "Web Development", hours: 4, type: "Elective", students: 32 },
      { name: "Machine Learning", hours: 3, type: "Elective", students: 28 },
      { name: "Software Engineering", hours: 1, type: "Core", students: 42 }
    ]
  };

  const weeklyTrend = [
    { week: "Week 1", hours: 16, target: 18 },
    { week: "Week 2", hours: 18, target: 18 },
    { week: "Week 3", hours: 17, target: 18 },
    { week: "Week 4", hours: 19, target: 18 },
    { week: "Week 5", hours: 18, target: 18 },
    { week: "Week 6", hours: 20, target: 18 }
  ];

  const subjectDistribution = [
    { name: "Core Subjects", value: 11, color: "#3B82F6" },
    { name: "Electives", value: 7, color: "#8B5CF6" }
  ];

  const performanceMetrics = [
    {
      label: "Teaching Load",
      current: workloadData.totalHours,
      max: workloadData.maxHours,
      percentage: (workloadData.totalHours / workloadData.maxHours) * 100,
      status: "good",
      icon: "Clock"
    },
    {
      label: "Total Students",
      current: workloadData.subjects.reduce((sum, subject) => sum + subject.students, 0),
      max: 200,
      percentage: (workloadData.subjects.reduce((sum, subject) => sum + subject.students, 0) / 200) * 100,
      status: "good",
      icon: "Users"
    },
    {
      label: "Subject Count",
      current: workloadData.subjects.length,
      max: 6,
      percentage: (workloadData.subjects.length / 6) * 100,
      status: "warning",
      icon: "BookOpen"
    },
    {
      label: "Lab Sessions",
      current: 2,
      max: 3,
      percentage: (2 / 3) * 100,
      status: "good",
      icon: "Monitor"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Workload Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your teaching load and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="current">Current Semester</option>
            <option value="previous">Previous Semester</option>
            <option value="yearly">Academic Year</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-md bg-muted ${getStatusColor(metric.status)}`}>
                <Icon name={metric.icon} size={16} />
              </div>
              <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.percentage.toFixed(0)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">{metric.current}</span>
                <span className="text-sm text-muted-foreground">/ {metric.max}</span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.percentage)}`}
                  style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Weekly Teaching Hours</h3>
            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="week" 
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
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="var(--color-muted-foreground)" 
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Subject Distribution</h3>
            <Icon name="PieChart" size={16} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            {subjectDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Details */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Subject Breakdown</h3>
          <button className="flex items-center space-x-2 px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth text-sm">
            <Icon name="Download" size={14} />
            <span>Export</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hours/Week</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Students</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Load %</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.subjects.map((subject, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-smooth">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-foreground">{subject.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      subject.type === 'Core' ?'bg-blue-100 text-blue-800' :'bg-purple-100 text-purple-800'
                    }`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{subject.hours}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground">{subject.students}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${(subject.hours / workloadData.maxHours) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {((subject.hours / workloadData.maxHours) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkloadAnalytics;