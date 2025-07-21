import React from 'react';
import Icon from '../AppIcon';

const BreadcrumbContext = ({ items = [], userRole = 'staff' }) => {
  // Default breadcrumb based on current path
  const getDefaultBreadcrumb = (path) => {
    const breadcrumbMap = {
      '/main-admin-dashboard': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Main Admin Dashboard', path: '/main-admin-dashboard', icon: 'LayoutDashboard' }
      ],
      '/department-admin-dashboard': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'Building2' }
      ],
      '/staff-dashboard': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Staff Dashboard', path: '/staff-dashboard', icon: 'LayoutDashboard' }
      ],
      '/timetable-management': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Timetable Management', path: '/timetable-management', icon: 'Calendar' }
      ],
      '/staff-registration-management': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users' }
      ],
      '/choice-form-creation-management': [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Choice Forms', path: '/choice-form-creation-management', icon: 'FileText' }
      ]
    };

    return breadcrumbMap[path] || [
      { label: 'Home', path: '/', icon: 'Home' },
      { label: 'Dashboard', path: `/${userRole}-dashboard`, icon: 'LayoutDashboard' }
    ];
  };

  // Use provided items or generate default based on current path
  const breadcrumbItems = items.length > 0 ? items : getDefaultBreadcrumb(window.location.pathname);

  const handleBreadcrumbClick = (path, event) => {
    if (path === window.location.pathname) {
      event.preventDefault();
      return;
    }
    // Navigation will be handled by the href
  };

  const truncateLabel = (label, maxLength = 25) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isClickable = item.path && !isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="mx-2 text-muted-foreground/50" 
                />
              )}
              
              <div className="flex items-center space-x-1">
                {item.icon && (
                  <Icon 
                    name={item.icon} 
                    size={14} 
                    className={isLast ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                )}
                
                {isClickable ? (
                  <a
                    href={item.path}
                    onClick={(e) => handleBreadcrumbClick(item.path, e)}
                    className="hover:text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1 py-0.5"
                    title={item.label}
                  >
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{truncateLabel(item.label, 15)}</span>
                  </a>
                ) : (
                  <span 
                    className={`${isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                    title={item.label}
                  >
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{truncateLabel(item.label, 15)}</span>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Quick Actions */}
      <div className="hidden md:flex items-center ml-auto space-x-2">
        <button
          onClick={() => window.history.back()}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          title="Go back"
        >
          <Icon name="ArrowLeft" size={16} />
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          title="Refresh page"
        >
          <Icon name="RotateCcw" size={16} />
        </button>
      </div>
    </nav>
  );
};

export default BreadcrumbContext;