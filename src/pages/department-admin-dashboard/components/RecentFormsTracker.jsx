import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentFormsTracker = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const formSubmissions = [
    {
      id: 1,
      formTitle: "Subject Preference Form - Fall 2024",
      staffName: "Dr. Sarah Johnson",
      submittedAt: "2024-07-21 09:30",
      status: "completed",
      responses: 8,
      totalQuestions: 10
    },
    {
      id: 2,
      formTitle: "Lab Coordinator Assignment",
      staffName: "Prof. Michael Chen",
      submittedAt: "2024-07-21 08:15",
      status: "partial",
      responses: 5,
      totalQuestions: 12
    },
    {
      id: 3,
      formTitle: "Workload Distribution Survey",
      staffName: "Dr. Emily Rodriguez",
      submittedAt: "2024-07-20 16:45",
      status: "completed",
      responses: 15,
      totalQuestions: 15
    },
    {
      id: 4,
      formTitle: "Teaching Availability Form",
      staffName: "Prof. David Kim",
      submittedAt: "2024-07-20 14:20",
      status: "pending",
      responses: 0,
      totalQuestions: 8
    },
    {
      id: 5,
      formTitle: "Course Material Upload",
      staffName: "Dr. Lisa Wang",
      submittedAt: "2024-07-20 11:10",
      status: "completed",
      responses: 6,
      totalQuestions: 6
    }
  ];

  const activeForms = [
    {
      id: 1,
      title: "Mid-Semester Feedback Collection",
      createdBy: "Department Admin",
      deadline: "2024-07-25 23:59",
      responses: 12,
      totalStaff: 25,
      status: "active"
    },
    {
      id: 2,
      title: "Next Semester Course Planning",
      createdBy: "Department Admin",
      deadline: "2024-07-30 23:59",
      responses: 8,
      totalStaff: 25,
      status: "active"
    },
    {
      id: 3,
      title: "Research Interest Survey",
      createdBy: "Department Admin",
      deadline: "2024-07-22 23:59",
      responses: 20,
      totalStaff: 25,
      status: "closing-soon"
    }
  ];

  const getStatusIcon = (status) => {
    const statusMap = {
      completed: { icon: 'CheckCircle', color: 'text-success' },
      partial: { icon: 'Clock', color: 'text-warning' },
      pending: { icon: 'AlertCircle', color: 'text-error' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      completed: 'bg-success/10 text-success',
      partial: 'bg-warning/10 text-warning',
      pending: 'bg-error/10 text-error'
    };
    return badgeMap[status] || badgeMap.pending;
  };

  const getFormStatusBadge = (status) => {
    const badgeMap = {
      active: 'bg-primary/10 text-primary',
      'closing-soon': 'bg-warning/10 text-warning',
      closed: 'bg-muted text-muted-foreground'
    };
    return badgeMap[status] || badgeMap.active;
  };

  const getCompletionPercentage = (responses, total) => {
    return Math.round((responses / total) * 100);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Recent Form Submissions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Submissions</h3>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {formSubmissions.slice(0, 4).map((submission) => {
            const statusInfo = getStatusIcon(submission.status);
            const completionRate = getCompletionPercentage(submission.responses, submission.totalQuestions);

            return (
              <div key={submission.id} className="p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-smooth">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {submission.formTitle}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      by {submission.staffName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <Icon name={statusInfo.icon} size={14} className={statusInfo.color} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTimeAgo(submission.submittedAt)}</span>
                  <span>{submission.responses}/{submission.totalQuestions} responses ({completionRate}%)</span>
                </div>

                {submission.status === 'partial' && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-warning h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" className="mt-4" fullWidth iconName="Eye">
          View All Submissions
        </Button>
      </div>

      {/* Active Forms */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Forms</h3>
          <Button variant="default" size="sm" iconName="Plus">
            Create Form
          </Button>
        </div>

        <div className="space-y-3">
          {activeForms.map((form) => {
            const responseRate = getCompletionPercentage(form.responses, form.totalStaff);
            const isClosingSoon = form.status === 'closing-soon';

            return (
              <div key={form.id} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {form.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Created by {form.createdBy}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormStatusBadge(form.status)}`}>
                    {form.status.replace('-', ' ')}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="font-medium text-foreground">
                      {form.responses}/{form.totalStaff} ({responseRate}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isClosingSoon ? 'bg-warning' : 'bg-primary'
                      }`}
                      style={{ width: `${responseRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Deadline: {new Date(form.deadline).toLocaleDateString()}
                    </span>
                    {isClosingSoon && (
                      <span className="text-warning font-medium flex items-center">
                        <Icon name="AlertTriangle" size={12} className="mr-1" />
                        Closing Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Analytics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Form Analytics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">15</div>
            <div className="text-xs text-muted-foreground">Active Forms</div>
          </div>
          <div className="text-center p-3 bg-success/5 rounded-lg">
            <div className="text-2xl font-bold text-success">89%</div>
            <div className="text-xs text-muted-foreground">Avg Response Rate</div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-4" fullWidth iconName="BarChart3">
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
};

export default RecentFormsTracker;