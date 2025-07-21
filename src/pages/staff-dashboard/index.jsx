import React, { useState, useEffect } from 'react';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import PersonalTimetable from './components/PersonalTimetable';
import WorkloadAnalytics from './components/WorkloadAnalytics';
import ActiveChoiceForms from './components/ActiveChoiceForms';
import ProfileInformation from './components/ProfileInformation';
import DepartmentFiles from './components/DepartmentFiles';
import RecentNotifications from './components/RecentNotifications';
import Icon from '../../components/AppIcon';

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock staff data
  const staffData = {
    name: "Dr. Sarah Johnson",
    department: "Computer Science & Engineering",
    employeeId: "SRM2023001",
    designation: "Assistant Professor"
  };

  // Mock notifications for header
  const notifications = [
    {
      message: "Schedule change for Machine Learning class",
      time: "2 hours ago",
      read: false
    },
    {
      message: "Choice form deadline approaching",
      time: "1 day ago",
      read: false
    },
    {
      message: "New document uploaded to department files",
      time: "2 days ago",
      read: true
    }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Staff Dashboard', path: '/staff-dashboard', icon: 'LayoutDashboard' }
  ];

  const tabNavigation = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'timetable', label: 'My Timetable', icon: 'Calendar' },
    { id: 'workload', label: 'Workload Analytics', icon: 'BarChart3' },
    { id: 'forms', label: 'Choice Forms', icon: 'FileText' },
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'files', label: 'Department Files', icon: 'FolderOpen' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  const quickStats = [
    {
      label: "Teaching Hours",
      value: "18/20",
      percentage: 90,
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      label: "Active Subjects",
      value: "5",
      percentage: 83,
      icon: "BookOpen",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Pending Forms",
      value: "2",
      percentage: 40,
      icon: "FileText",
      color: "text-error",
      bgColor: "bg-error/10"
    },
    {
      label: "Total Students",
      value: "185",
      percentage: 92,
      icon: "Users",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const upcomingClasses = [
    {
      subject: "Data Structures",
      time: "09:00 - 10:30",
      room: "Lab-A101",
      class: "CS-2A",
      type: "Lab"
    },
    {
      subject: "Machine Learning",
      time: "14:00 - 15:30",
      room: "Room-A301",
      class: "CS-5A",
      type: "Theory"
    },
    {
      subject: "Web Development",
      time: "16:00 - 17:30",
      room: "Lab-C102",
      class: "CS-4A",
      type: "Lab"
    }
  ];

  const recentActivity = [
    {
      action: "Submitted choice form for Spring 2025",
      time: "2 hours ago",
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      action: "Downloaded Database Lab Manual",
      time: "1 day ago",
      icon: "Download",
      color: "text-blue-600"
    },
    {
      action: "Updated profile information",
      time: "3 days ago",
      icon: "Edit",
      color: "text-purple-600"
    },
    {
      action: "Requested schedule change",
      time: "1 week ago",
      icon: "Calendar",
      color: "text-orange-600"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timetable':
        return <PersonalTimetable />;
      case 'workload':
        return <WorkloadAnalytics />;
      case 'forms':
        return <ActiveChoiceForms />;
      case 'profile':
        return <ProfileInformation />;
      case 'files':
        return <DepartmentFiles />;
      case 'notifications':
        return <RecentNotifications />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {staffData.name}!
                  </h1>
                  <p className="text-primary-foreground/90 mb-4">
                    {staffData.designation} • {staffData.department}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-primary-foreground/80">
                    <span>Employee ID: {staffData.employeeId}</span>
                    <span>•</span>
                    <span>{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Icon name="GraduationCap" size={64} className="text-primary-foreground/20" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-md ${stat.bgColor} ${stat.color}`}>
                      <Icon name={stat.icon} size={20} />
                    </div>
                    <span className={`text-sm font-medium ${stat.color}`}>
                      {stat.percentage}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stat.percentage >= 90 ? 'bg-error' :
                          stat.percentage >= 75 ? 'bg-warning': 'bg-success'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View Full Timetable
                  </button>
                </div>
                
                <div className="space-y-3">
                  {upcomingClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          classItem.type === 'Lab' ? 'bg-indigo-500' : 'bg-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {classItem.subject}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            classItem.type === 'Lab' ?'bg-indigo-100 text-indigo-800' :'bg-blue-100 text-blue-800'
                          }`}>
                            {classItem.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>{classItem.time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{classItem.room}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Users" size={12} />
                            <span>{classItem.class}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${activity.color}`}>
                        <Icon name={activity.icon} size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Submit Choice Form', icon: 'FileText', action: () => setActiveTab('forms') },
                  { label: 'View Workload', icon: 'BarChart3', action: () => setActiveTab('workload') },
                  { label: 'Update Profile', icon: 'User', action: () => setActiveTab('profile') },
                  { label: 'Access Files', icon: 'FolderOpen', action: () => setActiveTab('files') }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted transition-smooth text-left"
                  >
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <Icon name={action.icon} size={16} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </button>
                ))}
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
        userRole="staff"
        userName={staffData.name}
        notifications={notifications}
      />

      {/* Sidebar */}
      <NavigationSidebar
        userRole="staff"
        currentPath="/staff-dashboard"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className={`transition-layout ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} pt-16`}>
        <div className="p-6">
          {/* Breadcrumb and Status */}
          <div className="flex items-center justify-between mb-6">
            <BreadcrumbContext items={breadcrumbItems} userRole="staff" />
            <StatusIndicator
              connectionStatus="online"
              syncStatus="synced"
              lastSyncTime={new Date().toISOString()}
              pendingOperations={0}
              systemHealth="healthy"
            />
          </div>

          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border border-border mb-6">
            <div className="flex overflow-x-auto">
              {tabNavigation.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-smooth ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;