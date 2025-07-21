import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsPanel = ({ timetableData, viewMode }) => {
  const [activeTab, setActiveTab] = useState('workload');

  // Mock analytics data
  const workloadData = [
    { name: 'Dr. Smith', assigned: 18, limit: 20, efficiency: 90 },
    { name: 'Prof. Johnson', assigned: 16, limit: 18, efficiency: 89 },
    { name: 'Dr. Williams', assigned: 22, limit: 20, efficiency: 85 },
    { name: 'Prof. Brown', assigned: 14, limit: 16, efficiency: 88 },
    { name: 'Dr. Davis', assigned: 19, limit: 20, efficiency: 92 }
  ];

  const subjectDistribution = [
    { name: 'Core Subjects', value: 45, color: '#3B82F6' },
    { name: 'Electives', value: 25, color: '#10B981' },
    { name: 'Laboratory', value: 20, color: '#8B5CF6' },
    { name: 'Tutorials', value: 10, color: '#F59E0B' }
  ];

  const utilizationData = [
    { day: 'Monday', classrooms: 85, labs: 70, overall: 78 },
    { day: 'Tuesday', classrooms: 92, labs: 85, overall: 89 },
    { day: 'Wednesday', classrooms: 88, labs: 75, overall: 82 },
    { day: 'Thursday', classrooms: 90, labs: 80, overall: 85 },
    { day: 'Friday', classrooms: 87, labs: 90, overall: 89 },
    { day: 'Saturday', classrooms: 65, labs: 60, overall: 63 }
  ];

  const conflictData = [
    { type: 'Room Conflicts', count: 3, severity: 'high' },
    { type: 'Staff Conflicts', count: 1, severity: 'medium' },
    { type: 'Time Conflicts', count: 2, severity: 'high' },
    { type: 'Resource Conflicts', count: 0, severity: 'low' }
  ];

  const tabs = [
    { id: 'workload', label: 'Workload', icon: 'BarChart3' },
    { id: 'distribution', label: 'Distribution', icon: 'PieChart' },
    { id: 'utilization', label: 'Utilization', icon: 'TrendingUp' },
    { id: 'conflicts', label: 'Conflicts', icon: 'AlertTriangle' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      'high': 'text-error bg-error/10',
      'medium': 'text-warning bg-warning/10',
      'low': 'text-success bg-success/10'
    };
    return colors[severity] || 'text-muted-foreground bg-muted';
  };

  const renderWorkloadAnalytics = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workloadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="assigned" fill="var(--color-primary)" name="Assigned Hours" />
            <Bar dataKey="limit" fill="var(--color-muted)" name="Hour Limit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {workloadData.map((staff, index) => (
          <div key={index} className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{staff.name}</h4>
              <span className="text-xs text-muted-foreground">{staff.efficiency}% efficient</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${staff.assigned > staff.limit ? 'bg-error' : 'bg-primary'}`}
                style={{ width: `${Math.min((staff.assigned / staff.limit) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{staff.assigned}h assigned</span>
              <span>{staff.limit}h limit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDistributionAnalytics = () => (
    <div className="space-y-4">
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

      <div className="grid grid-cols-2 gap-3">
        {subjectDistribution.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUtilizationAnalytics = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="classrooms" stroke="var(--color-primary)" name="Classrooms" />
            <Line type="monotone" dataKey="labs" stroke="var(--color-accent)" name="Labs" />
            <Line type="monotone" dataKey="overall" stroke="var(--color-success)" name="Overall" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-primary">87%</p>
          <p className="text-xs text-muted-foreground">Avg Classroom Utilization</p>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-accent">77%</p>
          <p className="text-xs text-muted-foreground">Avg Lab Utilization</p>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-success">82%</p>
          <p className="text-xs text-muted-foreground">Overall Utilization</p>
        </div>
      </div>
    </div>
  );

  const renderConflictAnalytics = () => (
    <div className="space-y-4">
      {conflictData.map((conflict, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{conflict.type}</p>
              <p className="text-xs text-muted-foreground">
                {conflict.count} {conflict.count === 1 ? 'conflict' : 'conflicts'} detected
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(conflict.severity)}`}>
              {conflict.severity}
            </span>
            {conflict.count > 0 && (
              <Button variant="outline" size="sm">
                Resolve
              </Button>
            )}
          </div>
        </div>
      ))}

      {conflictData.every(c => c.count === 0) && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-3" />
          <p className="text-success font-medium">No conflicts detected!</p>
          <p className="text-sm text-muted-foreground">Your timetable is optimally scheduled.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center mb-3">
          <Icon name="BarChart3" size={18} className="mr-2" />
          Timetable Analytics
        </h3>

        <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth
                ${activeTab === tab.id 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'workload' && renderWorkloadAnalytics()}
        {activeTab === 'distribution' && renderDistributionAnalytics()}
        {activeTab === 'utilization' && renderUtilizationAnalytics()}
        {activeTab === 'conflicts' && renderConflictAnalytics()}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;