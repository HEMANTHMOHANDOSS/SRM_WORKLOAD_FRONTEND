import React, { useState, useEffect } from 'react';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import MetricsCard from './components/MetricsCard';
import DepartmentTable from './components/DepartmentTable';
import ActivityFeed from './components/ActivityFeed';
import PendingApprovals from './components/PendingApprovals';
import SystemAnalytics from './components/SystemAnalytics';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MainAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Mock data for dashboard
  const mockMetrics = [
    {
      title: "Total Departments",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: "Building2",
      description: "Active departments"
    },
    {
      title: "Active Staff",
      value: "248",
      change: "+15",
      changeType: "positive",
      icon: "Users",
      description: "Registered staff members"
    },
    {
      title: "Pending Approvals",
      value: "7",
      change: "-3",
      changeType: "negative",
      icon: "Clock",
      description: "Awaiting review"
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "+0.2%",
      changeType: "positive",
      icon: "Activity",
      description: "Overall system status"
    }
  ];

  const mockDepartments = [
    {
      id: 1,
      name: "Computer Science & Engineering",
      code: "CSE",
      adminName: "Dr. Rajesh Kumar",
      adminEmail: "rajesh.kumar@srm.edu.in",
      staffCount: 45,
      status: "active",
      timetableStatus: "generated"
    },
    {
      id: 2,
      name: "Electronics & Communication",
      code: "ECE",
      adminName: "Dr. Priya Sharma",
      adminEmail: "priya.sharma@srm.edu.in",
      staffCount: 38,
      status: "active",
      timetableStatus: "in-progress"
    },
    {
      id: 3,
      name: "Mechanical Engineering",
      code: "MECH",
      adminName: "Dr. Suresh Patel",
      adminEmail: "suresh.patel@srm.edu.in",
      staffCount: 42,
      status: "active",
      timetableStatus: "generated"
    },
    {
      id: 4,
      name: "Civil Engineering",
      code: "CIVIL",
      adminName: "Dr. Anita Verma",
      adminEmail: "anita.verma@srm.edu.in",
      staffCount: 35,
      status: "pending",
      timetableStatus: "not-started"
    },
    {
      id: 5,
      name: "Information Technology",
      code: "IT",
      adminName: "Dr. Vikram Singh",
      adminEmail: "vikram.singh@srm.edu.in",
      staffCount: 28,
      status: "active",
      timetableStatus: "generated"
    }
  ];

  const mockActivities = [
    {
      type: "department-created",
      title: "New Department Registered",
      description: "Information Technology department has been successfully registered",
      user: "System Admin",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      type: "staff-approved",
      title: "Staff Registration Approved",
      description: "5 new staff members approved for Computer Science department",
      user: "Dr. Rajesh Kumar",
      timestamp: new Date(Date.now() - 900000)
    },
    {
      type: "timetable-generated",
      title: "Timetable Generated",
      description: "AI-powered timetable generated for Electronics & Communication",
      user: "Dr. Priya Sharma",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      type: "system-alert",
      title: "System Maintenance Scheduled",
      description: "Scheduled maintenance window: Tonight 11:00 PM - 2:00 AM",
      user: "System",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      type: "credential-generated",
      title: "Credentials Generated",
      description: "Login credentials generated for Mechanical Engineering staff",
      user: "Dr. Suresh Patel",
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  const mockApprovals = [
    {
      id: 1,
      type: "staff-registration",
      title: "Staff Registration Request",
      description: "New faculty member registration for Computer Science department",
      requester: "Dr. Rajesh Kumar",
      department: "Computer Science",
      priority: "high",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      type: "department-request",
      title: "Department Access Request",
      description: "Request for additional lab access permissions",
      requester: "Dr. Priya Sharma",
      department: "Electronics & Communication",
      priority: "medium",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      type: "timetable-change",
      title: "Timetable Modification Request",
      description: "Request to modify lab schedule due to equipment maintenance",
      requester: "Dr. Suresh Patel",
      department: "Mechanical Engineering",
      priority: "medium",
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      type: "system-access",
      title: "System Access Request",
      description: "Request for admin privileges for new department head",
      requester: "Dr. Anita Verma",
      department: "Civil Engineering",
      priority: "high",
      timestamp: new Date(Date.now() - 10800000)
    }
  ];

  const mockAnalytics = {
    workloadData: [
      { department: 'CSE', assigned: 420, capacity: 500 },
      { department: 'ECE', assigned: 380, capacity: 450 },
      { department: 'MECH', assigned: 350, capacity: 400 },
      { department: 'CIVIL', assigned: 280, capacity: 350 },
      { department: 'IT', assigned: 240, capacity: 300 }
    ],
    departmentStatus: [
      { name: 'Active', value: 8 },
      { name: 'Pending', value: 2 },
      { name: 'Inactive', value: 2 }
    ],
    usageTrends: [
      { month: 'Jan', activeUsers: 180, timetablesGenerated: 12 },
      { month: 'Feb', activeUsers: 200, timetablesGenerated: 15 },
      { month: 'Mar', activeUsers: 220, timetablesGenerated: 18 },
      { month: 'Apr', activeUsers: 248, timetablesGenerated: 22 },
      { month: 'May', activeUsers: 265, timetablesGenerated: 25 }
    ],
    totalHours: "2,450",
    efficiency: 94,
    conflicts: 3,
    satisfaction: 87
  };

  const mockNotifications = [
    {
      message: "System maintenance scheduled for tonight",
      time: "2 hours ago",
      read: false
    },
    {
      message: "New department registration approved",
      time: "4 hours ago",
      read: false
    },
    {
      message: "Weekly system backup completed",
      time: "1 day ago",
      read: true
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
      setConnectionStatus(Math.random() > 0.1 ? 'online' : 'offline');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleMetricClick = (metric) => {
    console.log('Metric clicked:', metric);
  };

  const handleDepartmentAction = (action, departmentId) => {
    console.log(`${action} for department:`, departmentId);
  };

  const handleApprovalAction = (action, approvalId) => {
    console.log(`${action} approval:`, approvalId);
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Main Admin Dashboard', path: '/main-admin-dashboard', icon: 'LayoutDashboard' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        userRole="main-admin"
        userName="Admin User"
        notifications={mockNotifications}
      />

      {/* Sidebar */}
      <NavigationSidebar
        userRole="main-admin"
        currentPath="/main-admin-dashboard"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-layout ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}`}>
        <div className="p-6">
          {/* Breadcrumb and Status */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <BreadcrumbContext items={breadcrumbItems} userRole="main-admin" />
            <StatusIndicator
              connectionStatus={connectionStatus}
              syncStatus="synced"
              lastSyncTime={lastSyncTime}
              pendingOperations={mockApprovals.length}
              systemHealth="healthy"
            />
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Main Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Here's what's happening in your system today.
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleQuickAction('export-report')}
                >
                  Export Report
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => handleQuickAction('register-department')}
                >
                  Register Department
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockMetrics.map((metric, index) => (
              <MetricsCard
                key={index}
                {...metric}
                onClick={() => handleMetricClick(metric)}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Department Management - Takes 2 columns */}
            <div className="xl:col-span-2">
              <DepartmentTable
                departments={mockDepartments}
                onViewDetails={(id) => handleDepartmentAction('view', id)}
                onGenerateCredentials={(id) => handleDepartmentAction('credentials', id)}
                onDeleteDepartment={(id) => handleDepartmentAction('delete', id)}
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <ActivityFeed activities={mockActivities} />
              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Analytics - Takes 2 columns */}
            <div className="xl:col-span-2">
              <SystemAnalytics analyticsData={mockAnalytics} />
            </div>

            {/* Pending Approvals */}
            <div>
              <PendingApprovals
                approvals={mockApprovals}
                onApprove={(id) => handleApprovalAction('approve', id)}
                onReject={(id) => handleApprovalAction('reject', id)}
                onViewDetails={(id) => handleApprovalAction('view', id)}
              />
            </div>
          </div>

          {/* System Status Footer */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={14} />
                  <span>Last Backup: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={14} />
                  <span>248 Active Users</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                SRM Timetable Manager v2.1.0 | Academic Year 2024-25
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainAdminDashboard;