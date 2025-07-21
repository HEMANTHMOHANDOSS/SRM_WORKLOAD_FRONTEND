import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PublishedFormsTable = ({ onEditForm, onDuplicateForm }) => {
  const [sortBy, setSortBy] = useState('created');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockForms = [
    {
      id: 'FORM_001',
      title: 'Subject Selection - Fall 2024',
      status: 'active',
      submissions: 42,
      totalTargets: 65,
      responseRate: 64.6,
      created: '2024-07-15T10:30:00Z',
      opens: '2024-07-20T09:00:00Z',
      closes: '2024-07-25T23:59:00Z',
      category: 'subject-selection',
      priority: 'high'
    },
    {
      id: 'FORM_002',
      title: 'Workload Preferences - Spring 2024',
      status: 'closed',
      submissions: 58,
      totalTargets: 60,
      responseRate: 96.7,
      created: '2024-01-10T14:20:00Z',
      opens: '2024-01-15T09:00:00Z',
      closes: '2024-01-20T23:59:00Z',
      category: 'workload-preference',
      priority: 'medium'
    },
    {
      id: 'FORM_003',
      title: 'Lab Coordinator Assignment',
      status: 'draft',
      submissions: 0,
      totalTargets: 25,
      responseRate: 0,
      created: '2024-07-18T16:45:00Z',
      opens: null,
      closes: null,
      category: 'other',
      priority: 'low'
    },
    {
      id: 'FORM_004',
      title: 'Teaching Availability - Summer 2024',
      status: 'scheduled',
      submissions: 0,
      totalTargets: 40,
      responseRate: 0,
      created: '2024-07-19T11:15:00Z',
      opens: '2024-07-22T09:00:00Z',
      closes: '2024-07-28T23:59:00Z',
      category: 'availability',
      priority: 'medium'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'Play', label: 'Active' },
      closed: { color: 'bg-muted text-muted-foreground', icon: 'Square', label: 'Closed' },
      draft: { color: 'bg-warning text-warning-foreground', icon: 'Edit', label: 'Draft' },
      scheduled: { color: 'bg-primary text-primary-foreground', icon: 'Clock', label: 'Scheduled' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { color: 'text-error', icon: 'AlertTriangle' },
      high: { color: 'text-warning', icon: 'ArrowUp' },
      medium: { color: 'text-primary', icon: 'Minus' },
      low: { color: 'text-muted-foreground', icon: 'ArrowDown' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Icon name={config.icon} size={14} className={config.color} title={`${priority} priority`} />
    );
  };

  const getResponseRateColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-error';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'submissions':
        return b.submissions - a.submissions;
      case 'responseRate':
        return b.responseRate - a.responseRate;
      case 'created':
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center">
              <Icon name="FileText" size={18} className="mr-2" />
              Published Forms
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your published forms
            </p>
          </div>
          <Button variant="default" size="sm">
            <Icon name="Plus" size={14} className="mr-1" />
            New Form
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
          
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'draft', label: 'Draft' },
              { value: 'closed', label: 'Closed' }
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-40"
          />

          <Select
            options={[
              { value: 'created', label: 'Sort by Created' },
              { value: 'title', label: 'Sort by Title' },
              { value: 'status', label: 'Sort by Status' },
              { value: 'submissions', label: 'Sort by Submissions' },
              { value: 'responseRate', label: 'Sort by Response Rate' }
            ]}
            value={sortBy}
            onChange={setSortBy}
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">Form Details</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">Responses</th>
              <th className="text-left p-4 font-medium text-foreground">Schedule</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedForms.map((form) => (
              <tr key={form.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground truncate">{form.title}</h4>
                        {getPriorityBadge(form.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {form.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(form.created)}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  {getStatusBadge(form.status)}
                </td>
                
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{form.submissions}</span>
                      <span className="text-muted-foreground">/ {form.totalTargets}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${form.responseRate}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getResponseRateColor(form.responseRate)}`}>
                        {form.responseRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Play" size={12} className="text-success" />
                      <span className="text-muted-foreground">Opens:</span>
                      <span className="text-foreground">{formatDate(form.opens)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Square" size={12} className="text-error" />
                      <span className="text-muted-foreground">Closes:</span>
                      <span className="text-foreground">{formatDate(form.closes)}</span>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditForm(form)}
                      title="Edit Form"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicateForm(form)}
                      title="Duplicate Form"
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Responses"
                    >
                      <Icon name="BarChart3" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Export Data"
                    >
                      <Icon name="Download" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      title="More Options"
                    >
                      <Icon name="MoreVertical" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {sortedForms.length} of {mockForms.length} forms
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Active ({mockForms.filter(f => f.status === 'active').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span>Draft ({mockForms.filter(f => f.status === 'draft').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span>Closed ({mockForms.filter(f => f.status === 'closed').length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedFormsTable;