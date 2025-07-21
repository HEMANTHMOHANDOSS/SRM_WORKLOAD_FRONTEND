import React, { useState, useEffect } from 'react';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import DepartmentStatsCard from './components/DepartmentStatsCard';
import StaffManagementTable from './components/StaffManagementTable';
import TimetableGenerationPanel from './components/TimetableGenerationPanel';
import RecentFormsTracker from './components/RecentFormsTracker';
import AnalyticsChart from './components/AnalyticsChart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DepartmentAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for department statistics
  const departmentStats = [
    {
      title: "Total Staff",
      value: "25",
      icon: "Users",
      trend: "up",
      trendValue: "+3",
      color: "primary",
      onClick: () => setActiveTab('staff')
    },
    {
      title: "Active Forms",
      value: "8",
      icon: "FileText",
      trend: "up",
      trendValue: "+2",
      color: "success",
      onClick: () => setActiveTab('forms')
    },
    {
      title: "Completed Timetables",
      value: "12",
      icon: "Calendar",
      trend: "up",
      trendValue: "+4",
      color: "warning",
      onClick: () => setActiveTab('timetables')
    },
    {
      title: "Constraint Violations",
      value: "3",
      icon: "AlertTriangle",
      trend: "down",
      trendValue: "-2",
      color: "error",
      onClick: () => setActiveTab('violations')
    }
  ];

  // Mock notifications
  const notifications = [
    {
      message: "New staff registration request from Dr. John Smith",
      time: "5 minutes ago",
      read: false
    },
    {
      message: "Timetable generation completed for Fall 2024",
      time: "1 hour ago",
      read: false
    },
    {
      message: "Form submission deadline approaching",
      time: "2 hours ago",
      read: true
    }
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'Building2' }
  ];

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'staff', label: 'Staff Management', icon: 'Users' },
    { id: 'timetables', label: 'Timetables', icon: 'Calendar' },
    { id: 'forms', label: 'Forms', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const renderMobileTabContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffManagementTable />;
      case 'timetables':
        return <TimetableGenerationPanel />;
      case 'forms':
        return <RecentFormsTracker />;
      case 'analytics':
        return <AnalyticsChart />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {departmentStats.map((stat, index) => (
                <DepartmentStatsCard key={index} {...stat} />
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" iconName="Plus" iconPosition="left">
                  Add Staff
                </Button>
                <Button variant="outline" iconName="Calendar" iconPosition="left">
                  Generate Timetable
                </Button>
                <Button variant="outline" iconName="FileText" iconPosition="left">
                  Create Form
                </Button>
                <Button variant="outline" iconName="BarChart3" iconPosition="left">
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader 
        userRole="department-admin" 
        userName="Prof. Sarah Wilson"
        notifications={notifications}
      />

      {/* Sidebar */}
      <NavigationSidebar
        userRole="department-admin"
        currentPath="/department-admin-dashboard"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-layout ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          {/* Breadcrumb and Status */}
          <div className="flex items-center justify-between mb-6">
            <BreadcrumbContext items={breadcrumbItems} userRole="department-admin" />
            <StatusIndicator
              connectionStatus="online"
              syncStatus="synced"
              lastSyncTime={new Date(Date.now() - 300000)}
              pendingOperations={2}
              systemHealth="healthy"
            />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon name="Building2" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Department Dashboard</h1>
                <p className="text-muted-foreground">Computer Science & Engineering Department</p>
              </div>
            </div>
            
            {/* Department Info */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>Block A, 3rd Floor</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>25 Faculty Members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="GraduationCap" size={14} />
                <span>450 Students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>Academic Year 2024-25</span>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          {isMobile && (
            <div className="mb-6">
              <div className="flex overflow-x-auto space-x-1 p-1 bg-muted rounded-lg">
                {tabOptions.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-smooth ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Layout */}
          {isMobile ? (
            // Mobile Layout - Tabbed Interface
            <div>
              {renderMobileTabContent()}
            </div>
          ) : (
            // Desktop/Tablet Layout - Three Column
            <div className="grid grid-cols-12 gap-6">
              {/* Left Panel - Statistics (3 cols) */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="space-y-4">
                  {departmentStats.map((stat, index) => (
                    <DepartmentStatsCard key={index} {...stat} />
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
                      Add Staff
                    </Button>
                    <Button variant="outline" fullWidth iconName="Calendar" iconPosition="left">
                      Generate Timetable
                    </Button>
                    <Button variant="outline" fullWidth iconName="FileText" iconPosition="left">
                      Create Form
                    </Button>
                    <Button variant="outline" fullWidth iconName="BarChart3" iconPosition="left">
                      View Reports
                    </Button>
                  </div>
                </div>

                {/* CHITTU AI Integration */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name="Bot" size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">CHITTU AI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get AI-powered insights and assistance for departmental management.
                  </p>
                  <Button variant="default" fullWidth iconName="MessageCircle" iconPosition="left">
                    Chat with CHITTU
                  </Button>
                </div>
              </div>

              {/* Center Section - Staff Management (6 cols) */}
              <div className="col-span-12 lg:col-span-6">
                <StaffManagementTable />
              </div>

              {/* Right Panel - Timetable & Forms (3 cols) */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <TimetableGenerationPanel />
                <RecentFormsTracker />
              </div>
            </div>
          )}

          {/* Analytics Section - Full Width */}
          {!isMobile && (
            <div className="mt-8">
              <AnalyticsChart />
            </div>
          )}

          {/* Recent Activity Feed */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                {
                  icon: 'UserPlus',
                  text: 'Dr. John Smith submitted staff registration request',
                  time: '5 minutes ago',
                  color: 'text-primary'
                },
                {
                  icon: 'Calendar',
                  text: 'Timetable generation completed for Fall 2024 - 3rd Year',
                  time: '1 hour ago',
                  color: 'text-success'
                },
                {
                  icon: 'FileText',
                  text: 'Subject Preference Form deadline extended to July 25',
                  time: '2 hours ago',
                  color: 'text-warning'
                },
                {
                  icon: 'AlertTriangle',
                  text: 'Workload constraint violation detected for Prof. Chen',
                  time: '3 hours ago',
                  color: 'text-error'
                },
                {
                  icon: 'CheckCircle',
                  text: 'Lab Coordinator assignments approved for all subjects',
                  time: '4 hours ago',
                  color: 'text-success'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
                  <Icon name={activity.icon} size={16} className={activity.color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4" fullWidth iconName="Eye">
              View All Activity
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentAdminDashboard;