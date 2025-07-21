import React from 'react';
import Icon from '../../../components/AppIcon';

const ViewSwitcher = ({ currentView, onViewChange, viewCounts }) => {
  const views = [
    {
      id: 'department',
      label: 'Department',
      icon: 'Building2',
      description: 'Overall department schedule',
      count: viewCounts?.department || 0
    },
    {
      id: 'class',
      label: 'Class',
      icon: 'Users',
      description: 'Class-wise timetables',
      count: viewCounts?.class || 0
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: 'User',
      description: 'Individual staff schedules',
      count: viewCounts?.staff || 0
    },
    {
      id: 'classroom',
      label: 'Classroom',
      icon: 'MapPin',
      description: 'Room utilization view',
      count: viewCounts?.classroom || 0
    },
    {
      id: 'lab',
      label: 'Lab',
      icon: 'Microscope',
      description: 'Laboratory schedules',
      count: viewCounts?.lab || 0
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-1">
      <div className="flex space-x-1">
        {views.map((view) => {
          const isActive = currentView === view.id;
          
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              title={view.description}
            >
              <Icon 
                name={view.icon} 
                size={16} 
                className={isActive ? 'text-primary-foreground' : ''} 
              />
              <span>{view.label}</span>
              {view.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {view.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* View Description */}
      <div className="mt-3 px-3 py-2 bg-muted/30 rounded-md">
        <p className="text-xs text-muted-foreground">
          {views.find(v => v.id === currentView)?.description}
        </p>
      </div>
    </div>
  );
};

export default ViewSwitcher;