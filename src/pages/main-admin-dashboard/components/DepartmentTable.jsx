import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DepartmentTable = ({ departments, onViewDetails, onGenerateCredentials, onDeleteDepartment }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedDepartments = departments
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return (aValue - bValue) * modifier;
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      inactive: { color: 'bg-error/10 text-error', icon: 'XCircle' },
      pending: { color: 'bg-warning/10 text-warning', icon: 'Clock' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getTimetableStatusBadge = (status) => {
    const statusConfig = {
      generated: { color: 'bg-success/10 text-success', icon: 'Calendar' },
      'in-progress': { color: 'bg-warning/10 text-warning', icon: 'Clock' },
      'not-started': { color: 'bg-muted text-muted-foreground', icon: 'CalendarX' }
    };
    
    const config = statusConfig[status] || statusConfig['not-started'];
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span className="capitalize">{status.replace('-', ' ')}</span>
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Department Management</h2>
            <p className="text-sm text-muted-foreground">Manage departments and their administrators</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => console.log('Register new department')}
            >
              Register Department
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Department</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('adminName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Admin</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('staffCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Staff Count</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Timetable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredAndSortedDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{department.name}</div>
                      <div className="text-sm text-muted-foreground">{department.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">{department.adminName}</div>
                    <div className="text-sm text-muted-foreground">{department.adminEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{department.staffCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(department.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTimetableStatusBadge(department.timetableStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(department.id)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Key"
                      onClick={() => onGenerateCredentials(department.id)}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteDepartment(department.id)}
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedDepartments.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Building2" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No departments found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by registering your first department'}
          </p>
          {!searchTerm && (
            <Button variant="default" iconName="Plus" iconPosition="left">
              Register First Department
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;