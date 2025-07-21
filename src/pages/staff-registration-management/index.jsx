import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import StaffTable from './components/StaffTable';
import PendingApprovalsTable from './components/PendingApprovalsTable';
import RegistrationForm from './components/RegistrationForm';
import StaffFilters from './components/StaffFilters';
import StaffStatistics from './components/StaffStatistics';

const StaffRegistrationManagement = () => {
  const [activeTab, setActiveTab] = useState('active-staff');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedStaff, setSelectedStaff] = useState([]);

  // Mock user data
  const currentUser = {
    role: 'department-admin',
    name: 'Dr. Sarah Johnson',
    department: 'Computer Science'
  };

  // Mock notifications
  const notifications = [
    {
      message: "New staff registration request from John Smith",
      time: "2 minutes ago",
      read: false
    },
    {
      message: "Staff credentials generated for 3 new members",
      time: "1 hour ago",
      read: false
    },
    {
      message: "Monthly staff report is ready for download",
      time: "3 hours ago",
      read: true
    }
  ];

  // Mock staff data
  const mockStaffData = [
    {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@srm.edu",
      employeeId: "SRM001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      subjects: ["Data Structures", "Algorithms", "Machine Learning"],
      workloadStatus: "Optimal",
      currentHours: 18,
      maxHours: 20,
      lastActivity: "Form submission",
      lastActivityTime: "2 hours ago",
      status: "active",
      phone: "+91 9876543210",
      experience: 8,
      qualification: "Ph.D in Computer Science",
      specialization: "Artificial Intelligence"
    },
    {
      id: 2,
      name: "Prof. Lisa Anderson",
      email: "lisa.anderson@srm.edu",
      employeeId: "SRM002",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      subjects: ["Database Systems", "Web Development"],
      workloadStatus: "Under-loaded",
      currentHours: 12,
      maxHours: 20,
      lastActivity: "Timetable review",
      lastActivityTime: "1 day ago",
      status: "active",
      phone: "+91 9876543211",
      experience: 12,
      qualification: "M.Tech in Information Technology",
      specialization: "Database Management"
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@srm.edu",
      employeeId: "SRM003",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      subjects: ["Software Engineering", "Project Management", "System Design"],
      workloadStatus: "Over-loaded",
      currentHours: 24,
      maxHours: 20,
      lastActivity: "Class conducted",
      lastActivityTime: "30 minutes ago",
      status: "active",
      phone: "+91 9876543212",
      experience: 15,
      qualification: "Ph.D in Software Engineering",
      specialization: "Software Architecture"
    },
    {
      id: 4,
      name: "Dr. Emily Watson",
      email: "emily.watson@srm.edu",
      employeeId: "SRM004",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      subjects: ["Computer Networks", "Cybersecurity"],
      workloadStatus: "Optimal",
      currentHours: 19,
      maxHours: 20,
      lastActivity: "Lab session",
      lastActivityTime: "4 hours ago",
      status: "on-leave",
      phone: "+91 9876543213",
      experience: 6,
      qualification: "M.Tech in Computer Networks",
      specialization: "Network Security"
    }
  ];

  // Mock pending approvals data
  const mockPendingData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@gmail.com",
      phone: "+91 9876543214",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      submittedDate: "Jan 20, 2025",
      submittedTime: "10:30 AM",
      priority: "high",
      status: "pending",
      documentsCount: 4,
      documentsVerified: false,
      experience: 5,
      qualification: "M.Tech in Computer Science",
      specialization: "Machine Learning",
      subjects: ["Python Programming", "Data Science", "AI Fundamentals"]
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@gmail.com",
      phone: "+91 9876543215",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      submittedDate: "Jan 19, 2025",
      submittedTime: "2:15 PM",
      priority: "medium",
      status: "under-review",
      documentsCount: 5,
      documentsVerified: true,
      experience: 3,
      qualification: "M.Sc in Mathematics",
      specialization: "Applied Mathematics",
      subjects: ["Mathematics", "Statistics", "Discrete Mathematics"]
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david.wilson@gmail.com",
      phone: "+91 9876543216",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      submittedDate: "Jan 18, 2025",
      submittedTime: "4:45 PM",
      priority: "low",
      status: "documents-required",
      documentsCount: 3,
      documentsVerified: false,
      experience: 7,
      qualification: "Ph.D in Electronics",
      specialization: "VLSI Design",
      subjects: ["Digital Electronics", "VLSI Design", "Microprocessors"]
    }
  ];

  // Mock statistics data
  const mockStats = {
    totalStaff: 45,
    activeStaff: 42,
    pendingApprovals: 8,
    monthlyRegistrations: 12,
    staffChange: 8.5,
    activeChange: 5.2,
    pendingChange: -12.3,
    monthlyChange: 25.0,
    underLoaded: 8,
    optimal: 28,
    overLoaded: 9,
    departmentBreakdown: [
      { name: "Computer Science", totalStaff: 15, activeStaff: 14, pendingApprovals: 3 },
      { name: "Electronics", totalStaff: 12, activeStaff: 11, pendingApprovals: 2 },
      { name: "Mechanical", totalStaff: 10, activeStaff: 10, pendingApprovals: 1 },
      { name: "Civil", totalStaff: 8, activeStaff: 7, pendingApprovals: 2 }
    ],
    recentActivity: [
      { type: "registration", message: "New staff member John Smith registered", time: "2 hours ago" },
      { type: "approval", message: "Maria Garcia\'s application approved", time: "4 hours ago" },
      { type: "update", message: "Dr. Chen updated subject preferences", time: "6 hours ago" },
      { type: "registration", message: "David Wilson submitted registration", time: "1 day ago" }
    ]
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Management', path: '/management', icon: 'Settings' },
    { label: 'Staff Registration', path: '/staff-registration-management', icon: 'Users' }
  ];

  const tabs = [
    { id: 'active-staff', label: 'Active Staff', icon: 'Users', count: mockStaffData.length },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: 'Clock', count: mockPendingData.length },
    { id: 'registration', label: 'Registration', icon: 'UserPlus', count: null }
  ];

  const handleViewProfile = (staff) => {
    console.log('Viewing profile for:', staff.name);
  };

  const handleManageCredentials = (staff) => {
    console.log('Managing credentials for:', staff.name);
  };

  const handleEditStaff = (staff) => {
    console.log('Editing staff:', staff.name);
  };

  const handleApproveRequest = (requestId, comment) => {
    console.log('Approving request:', requestId, 'with comment:', comment);
  };

  const handleRejectRequest = (requestId, comment) => {
    console.log('Rejecting request:', requestId, 'with comment:', comment);
  };

  const handleViewDetails = (request) => {
    console.log('Viewing details for:', request.name);
  };

  const handleRegistrationSubmit = (formData) => {
    console.log('Registration submitted:', formData);
    setShowRegistrationForm(false);
    setActiveTab('pending-approvals');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleExport = () => {
    console.log('Exporting staff data...');
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'for selected staff:', selectedStaff);
  };

  const filteredStaffData = mockStaffData.filter(staff => {
    if (filters.search && !staff.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !staff.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !staff.employeeId.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.workloadStatus && staff.workloadStatus !== filters.workloadStatus) {
      return false;
    }
    if (filters.status && staff.status !== filters.status) {
      return false;
    }
    if (filters.subjects && !staff.subjects.some(subject => 
        subject.toLowerCase().includes(filters.subjects.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active-staff':
        return (
          <div className="space-y-6">
            <StaffFilters
              onFilterChange={handleFilterChange}
              onExport={handleExport}
              onBulkAction={handleBulkAction}
            />
            <StaffTable
              staffData={filteredStaffData}
              onViewProfile={handleViewProfile}
              onManageCredentials={handleManageCredentials}
              onEditStaff={handleEditStaff}
            />
          </div>
        );
      
      case 'pending-approvals':
        return (
          <PendingApprovalsTable
            pendingData={mockPendingData}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onViewDetails={handleViewDetails}
          />
        );
      
      case 'registration':
        return showRegistrationForm ? (
          <RegistrationForm
            onSubmit={handleRegistrationSubmit}
            onCancel={() => setShowRegistrationForm(false)}
          />
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="UserPlus" size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Register New Staff</h3>
            <p className="text-muted-foreground mb-6">
              Add new faculty members to your department with our streamlined registration process.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowRegistrationForm(true)}
            >
              Start Registration
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader
        userRole={currentUser.role}
        userName={currentUser.name}
        notifications={notifications}
      />
      
      <NavigationSidebar
        userRole={currentUser.role}
        currentPath="/staff-registration-management"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`transition-layout ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} pt-16`}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <BreadcrumbContext items={breadcrumbItems} userRole={currentUser.role} />
                  <h1 className="text-2xl font-bold text-foreground">Staff Registration & Management</h1>
                  <p className="text-muted-foreground">
                    Manage faculty registration, approvals, and staff information for {currentUser.department} Department
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusIndicator
                    connectionStatus="online"
                    syncStatus="synced"
                    lastSyncTime={new Date(Date.now() - 300000)}
                    pendingOperations={0}
                    systemHealth="healthy"
                  />
                  <Button
                    variant="default"
                    iconName="UserPlus"
                    iconPosition="left"
                    onClick={() => {
                      setActiveTab('registration');
                      setShowRegistrationForm(true);
                    }}
                  >
                    Add Staff
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-smooth ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                {renderTabContent()}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-80 space-y-6">
              <StaffStatistics stats={mockStats} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffRegistrationManagement;