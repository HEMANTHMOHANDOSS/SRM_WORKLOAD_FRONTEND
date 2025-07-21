import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const NavigationSidebar = ({ userRole = 'staff', currentPath = '/', isOpen = true, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationStructure = {
    'main-admin': [
      {
        section: 'Dashboard',
        items: [
          { label: 'Main Dashboard', path: '/main-admin-dashboard', icon: 'LayoutDashboard', description: 'System overview and metrics' }
        ]
      },
      {
        section: 'Management',
        items: [
          { label: 'Department Management', path: '/department-admin-dashboard', icon: 'Building2', description: 'Manage departments and admins' },
          { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users', description: 'Register and manage staff' }
        ]
      }
    ],
    'department-admin': [
      {
        section: 'Dashboard',
        items: [
          { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'LayoutDashboard', description: 'Department overview' }
        ]
      },
      {
        section: 'Timetable',
        items: [
          { label: 'Timetable Management', path: '/timetable-management', icon: 'Calendar', description: 'AI-powered scheduling' }
        ]
      },
      {
        section: 'Management',
        items: [
          { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users', description: 'Manage department staff' },
          { label: 'Choice Forms', path: '/choice-form-creation-management', icon: 'FileText', description: 'Create and manage forms' }
        ]
      }
    ],
    'staff': [
      {
        section: 'Dashboard',
        items: [
          { label: 'Staff Dashboard', path: '/staff-dashboard', icon: 'LayoutDashboard', description: 'Personal overview' }
        ]
      },
      {
        section: 'Schedule',
        items: [
          { label: 'My Timetable', path: '/timetable-management', icon: 'Calendar', description: 'View your schedule' }
        ]
      },
      {
        section: 'Forms',
        items: [
          { label: 'Choice Forms', path: '/choice-form-creation-management', icon: 'FileText', description: 'Submit preferences' }
        ]
      }
    ]
  };

  const currentNavigation = navigationStructure[userRole] || navigationStructure['staff'];

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const isActive = (path) => {
    return currentPath === path;
  };

  const sidebarClasses = `
    fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border z-1100 transition-layout
    ${isOpen ? 'w-64' : 'w-16'}
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
    ${isMobile && isOpen ? 'shadow-floating' : ''}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-1000 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isOpen && (
              <div className="flex items-center space-x-2">
                <Icon name="Navigation" size={20} className="text-primary" />
                <span className="font-medium text-foreground">Navigation</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name={isOpen ? "ChevronLeft" : "ChevronRight"} size={16} />
            </button>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto py-4">
            {currentNavigation.map((section, sectionIndex) => (
              <div key={section.section} className="mb-6">
                {/* Section Header */}
                {isOpen && (
                  <button
                    onClick={() => toggleSection(section.section)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-smooth"
                  >
                    <span>{section.section}</span>
                    <Icon 
                      name="ChevronDown" 
                      size={12} 
                      className={`transition-transform ${expandedSections[section.section] ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}

                {/* Section Items */}
                <div className={`space-y-1 ${isOpen && !expandedSections[section.section] && sectionIndex > 0 ? 'hidden' : ''}`}>
                  {section.items.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center px-4 py-2 mx-2 rounded-md text-sm font-medium transition-smooth group
                        ${isActive(item.path) 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                      title={!isOpen ? item.label : ''}
                    >
                      <Icon 
                        name={item.icon} 
                        size={18} 
                        className={`${isOpen ? 'mr-3' : 'mx-auto'} ${isActive(item.path) ? 'text-primary-foreground' : ''}`}
                      />
                      {isOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{item.label}</div>
                          {item.description && (
                            <div className="text-xs opacity-75 truncate">{item.description}</div>
                          )}
                        </div>
                      )}
                      {isActive(item.path) && (
                        <div className="w-1 h-6 bg-primary-foreground rounded-full ml-2" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-border p-4">
            {isOpen ? (
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">SRM Timetable Manager</p>
                <p>Academic Year 2024-25</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">SRM</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;