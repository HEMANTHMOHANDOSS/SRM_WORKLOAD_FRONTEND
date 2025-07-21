import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';


const RoleBasedHeader = ({ userRole = 'staff', userName = 'John Doe', notifications = [] }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.1 ? 'online' : 'offline');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const roleBasedNavigation = {
    'main-admin': [
      { label: 'Main Dashboard', path: '/main-admin-dashboard', icon: 'LayoutDashboard' },
      { label: 'Department Management', path: '/department-admin-dashboard', icon: 'Building2' },
      { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users' },
    ],
    'department-admin': [
      { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'LayoutDashboard' },
      { label: 'Timetable Management', path: '/timetable-management', icon: 'Calendar' },
      { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users' },
      { label: 'Choice Forms', path: '/choice-form-creation-management', icon: 'FileText' },
    ],
    'staff': [
      { label: 'Staff Dashboard', path: '/staff-dashboard', icon: 'LayoutDashboard' },
      { label: 'My Timetable', path: '/timetable-management', icon: 'Calendar' },
      { label: 'Choice Forms', path: '/choice-form-creation-management', icon: 'FileText' },
    ]
  };

  const currentNavigation = roleBasedNavigation[userRole] || roleBasedNavigation['staff'];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleChatbotClick = () => {
    // CHITTU AI chatbot integration
    console.log('Opening CHITTU AI chatbot');
  };

  const handleLogout = () => {
    console.log('Logging out user');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SRM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Timetable Manager</h1>
              <p className="text-xs text-muted-foreground">Academic Scheduling System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {currentNavigation.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center space-x-2 px-2 py-1 rounded-md bg-muted">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-success animate-pulse' : 'bg-error'}`} />
            <span className="text-xs text-muted-foreground capitalize">{connectionStatus}</span>
          </div>

          {/* CHITTU AI Chatbot */}
          <button
            onClick={handleChatbotClick}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            title="CHITTU AI Assistant"
          >
            <Icon name="Bot" size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-floating z-1200">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification, index) => (
                      <div key={index} className="p-3 border-b border-border last:border-b-0 hover:bg-muted">
                        <p className="text-sm text-popover-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden md:block text-sm font-medium">{userName}</span>
              <Icon name="ChevronDown" size={16} className="hidden md:block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-floating z-1200">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-popover-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole.replace('-', ' ')}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help</span>
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-error hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="px-4 py-2 space-y-1">
            {currentNavigation.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default RoleBasedHeader;