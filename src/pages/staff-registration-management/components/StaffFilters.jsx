import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StaffFilters = ({ onFilterChange, onExport, onBulkAction }) => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    workloadStatus: '',
    employmentType: '',
    status: '',
    subjects: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      department: '',
      workloadStatus: '',
      employmentType: '',
      status: '',
      subjects: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search staff by name, email, or employee ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Filter"
            onClick={() => setIsExpanded(!isExpanded)}
            className={hasActiveFilters ? 'border-primary text-primary' : ''}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="computer-science">Computer Science</option>
                <option value="electronics">Electronics</option>
                <option value="mechanical">Mechanical</option>
                <option value="civil">Civil</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Workload Status
              </label>
              <select
                value={filters.workloadStatus}
                onChange={(e) => handleFilterChange('workloadStatus', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">All Workloads</option>
                <option value="Under-loaded">Under-loaded</option>
                <option value="Optimal">Optimal</option>
                <option value="Over-loaded">Over-loaded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Employment Type
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="visiting">Visiting</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            
            <div>
              <Input
                label="Subject Expertise"
                type="text"
                placeholder="e.g., Mathematics, Physics"
                value={filters.subjects}
                onChange={(e) => handleFilterChange('subjects', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              iconName="X"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                iconName="Users"
                onClick={() => onBulkAction('credentials')}
              >
                Bulk Credentials
              </Button>
              <Button
                variant="outline"
                iconName="Mail"
                onClick={() => onBulkAction('notify')}
              >
                Bulk Notify
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffFilters;