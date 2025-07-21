import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const SubmissionTracker = () => {
  const [selectedForm, setSelectedForm] = useState('FORM_001');
  const [timeRange, setTimeRange] = useState('7d');

  const formOptions = [
    { value: 'FORM_001', label: 'Subject Selection - Fall 2024' },
    { value: 'FORM_002', label: 'Workload Preferences - Spring 2024' },
    { value: 'FORM_003', label: 'Lab Coordinator Assignment' },
    { value: 'FORM_004', label: 'Teaching Availability - Summer 2024' }
  ];

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  // Mock data for charts
  const submissionsByDay = [
    { day: 'Mon', submissions: 8, target: 10 },
    { day: 'Tue', submissions: 12, target: 10 },
    { day: 'Wed', submissions: 6, target: 10 },
    { day: 'Thu', submissions: 15, target: 10 },
    { day: 'Fri', submissions: 9, target: 10 },
    { day: 'Sat', submissions: 3, target: 10 },
    { day: 'Sun', submissions: 1, target: 10 }
  ];

  const departmentData = [
    { name: 'CSE', value: 18, color: '#1E3A8A' },
    { name: 'ECE', value: 12, color: '#10B981' },
    { name: 'MECH', value: 8, color: '#F59E0B' },
    { name: 'CIVIL', value: 4, color: '#EF4444' }
  ];

  const completionTrend = [
    { time: '9 AM', completed: 5, pending: 60 },
    { time: '12 PM', completed: 15, pending: 50 },
    { time: '3 PM', completed: 28, pending: 37 },
    { time: '6 PM', completed: 42, pending: 23 },
    { time: '9 PM', completed: 45, pending: 20 }
  ];

  const recentSubmissions = [
    {
      id: 1,
      staffName: 'Dr. Sarah Johnson',
      department: 'CSE',
      submittedAt: '2024-07-21T13:30:00Z',
      status: 'completed',
      completionTime: '8 minutes'
    },
    {
      id: 2,
      staffName: 'Prof. Michael Chen',
      department: 'ECE',
      submittedAt: '2024-07-21T13:15:00Z',
      status: 'completed',
      completionTime: '12 minutes'
    },
    {
      id: 3,
      staffName: 'Dr. Emily Rodriguez',
      department: 'CSE',
      submittedAt: '2024-07-21T12:45:00Z',
      status: 'draft',
      completionTime: 'In progress'
    },
    {
      id: 4,
      staffName: 'Prof. David Kumar',
      department: 'MECH',
      submittedAt: '2024-07-21T12:30:00Z',
      status: 'completed',
      completionTime: '6 minutes'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', icon: 'CheckCircle', label: 'Completed' },
      draft: { color: 'bg-warning text-warning-foreground', icon: 'Clock', label: 'Draft' },
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Circle', label: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="BarChart3" size={18} className="mr-2" />
            Submission Tracking
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time form submission analytics and monitoring
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            options={formOptions}
            value={selectedForm}
            onChange={setSelectedForm}
            className="w-64"
          />
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={14} className="mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-xs text-success">+8 today</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileCheck" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold text-foreground">64.6%</p>
              <p className="text-xs text-warning">42 of 65</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Completion</p>
              <p className="text-2xl font-bold text-foreground">8.5m</p>
              <p className="text-xs text-muted-foreground">minutes</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-xs text-error">overdue: 5</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Submissions Chart */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Daily Submissions</h4>
            <Icon name="BarChart3" size={16} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="submissions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Department Distribution</h4>
            <Icon name="PieChart" size={16} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dept.color }}
                />
                <span className="text-sm text-foreground">{dept.name}</span>
                <span className="text-sm text-muted-foreground">({dept.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Completion Trend (Today)</h4>
          <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="var(--color-warning)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="Activity" size={16} className="mr-2" />
              Recent Submissions
            </h4>
            <Button variant="outline" size="sm">
              <Icon name="ExternalLink" size={14} className="mr-1" />
              View All
            </Button>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{submission.staffName}</p>
                    <p className="text-sm text-muted-foreground">{submission.department} Department</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-foreground">{formatTime(submission.submittedAt)}</p>
                    <p className="text-xs text-muted-foreground">{submission.completionTime}</p>
                  </div>
                  {getStatusBadge(submission.status)}
                  <Button variant="ghost" size="icon">
                    <Icon name="Eye" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionTracker;