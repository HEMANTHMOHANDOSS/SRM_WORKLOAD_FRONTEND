import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StaffTable = ({ staffData, onViewProfile, onManageCredentials, onEditStaff }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...staffData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getWorkloadStatusColor = (status) => {
    switch (status) {
      case 'Under-loaded':
        return 'text-warning bg-warning/10';
      case 'Optimal':
        return 'text-success bg-success/10';
      case 'Over-loaded':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'inactive':
        return { icon: 'XCircle', color: 'text-error' };
      case 'on-leave':
        return { icon: 'Clock', color: 'text-warning' };
      default:
        return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Staff Member</span>
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('subjects')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Subjects</span>
                  <Icon 
                    name={sortField === 'subjects' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('workloadStatus')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Workload</span>
                  <Icon 
                    name={sortField === 'workloadStatus' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Last Activity</span>
                  <Icon 
                    name={sortField === 'lastActivity' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((staff) => {
              const statusInfo = getStatusIcon(staff.status);
              return (
                <tr key={staff.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{staff.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{staff.email}</p>
                        <p className="text-xs text-muted-foreground">{staff.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {staff.subjects.slice(0, 2).map((subject, index) => (
                        <span
                          key={index}
                          className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-md mr-1"
                        >
                          {subject}
                        </span>
                      ))}
                      {staff.subjects.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{staff.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${getWorkloadStatusColor(staff.workloadStatus)}`}>
                        {staff.workloadStatus}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {staff.currentHours}/{staff.maxHours} hrs/week
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{staff.lastActivity}</p>
                    <p className="text-xs text-muted-foreground">{staff.lastActivityTime}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={statusInfo.icon} size={16} className={statusInfo.color} />
                      <span className={`text-sm capitalize ${statusInfo.color}`}>
                        {staff.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onViewProfile(staff)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Settings"
                        onClick={() => onManageCredentials(staff)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Manage
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEditStaff(staff)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTable;