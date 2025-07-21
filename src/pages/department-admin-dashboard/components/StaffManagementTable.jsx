import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StaffManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const staffData = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@srm.edu",
      subjects: ["Data Structures", "Algorithms"],
      workloadHours: 18,
      maxHours: 20,
      status: "active",
      approvalStatus: "approved",
      joinDate: "2024-01-15",
      phone: "+1-555-0123"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@srm.edu",
      subjects: ["Database Systems", "Web Development"],
      workloadHours: 22,
      maxHours: 20,
      status: "active",
      approvalStatus: "pending",
      joinDate: "2024-02-20",
      phone: "+1-555-0124"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@srm.edu",
      subjects: ["Machine Learning", "AI Fundamentals"],
      workloadHours: 16,
      maxHours: 20,
      status: "active",
      approvalStatus: "approved",
      joinDate: "2024-01-10",
      phone: "+1-555-0125"
    },
    {
      id: 4,
      name: "Prof. David Kim",
      email: "david.kim@srm.edu",
      subjects: ["Software Engineering", "Project Management"],
      workloadHours: 19,
      maxHours: 20,
      status: "inactive",
      approvalStatus: "approved",
      joinDate: "2023-12-05",
      phone: "+1-555-0126"
    },
    {
      id: 5,
      name: "Dr. Lisa Wang",
      email: "lisa.wang@srm.edu",
      subjects: ["Computer Networks", "Cybersecurity"],
      workloadHours: 15,
      maxHours: 20,
      status: "active",
      approvalStatus: "rejected",
      joinDate: "2024-03-01",
      phone: "+1-555-0127"
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const approvalOptions = [
    { value: "all", label: "All Approvals" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" }
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "workload", label: "Workload" },
    { value: "joinDate", label: "Join Date" }
  ];

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || staff.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getWorkloadStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage > 100) return { status: 'overload', color: 'text-error', bg: 'bg-error/10' };
    if (percentage > 85) return { status: 'high', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'normal', color: 'text-success', bg: 'bg-success/10' };
  };

  const getApprovalBadge = (status) => {
    const badges = {
      approved: { color: 'bg-success text-success-foreground', icon: 'Check' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      rejected: { color: 'bg-error text-error-foreground', icon: 'X' }
    };
    return badges[status] || badges.pending;
  };

  const handleApprove = (staffId) => {
    console.log(`Approving staff with ID: ${staffId}`);
  };

  const handleReject = (staffId) => {
    console.log(`Rejecting staff with ID: ${staffId}`);
  };

  const handleEdit = (staffId) => {
    console.log(`Editing staff with ID: ${staffId}`);
  };

  const handleViewDetails = (staffId) => {
    console.log(`Viewing details for staff with ID: ${staffId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Staff Management</h2>
          <Button variant="default" iconName="Plus" iconPosition="left">
            Add Staff
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
          <Select
            options={approvalOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by approval"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Staff Member</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Subjects</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Workload</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Approval</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => {
              const workloadStatus = getWorkloadStatus(staff.workloadHours, staff.maxHours);
              const approvalBadge = getApprovalBadge(staff.approvalStatus);

              return (
                <tr key={staff.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{staff.name}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {staff.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${workloadStatus.bg}`}>
                      <span className={`text-sm font-medium ${workloadStatus.color}`}>
                        {staff.workloadHours}/{staff.maxHours}h
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${approvalBadge.color}`}>
                      <Icon name={approvalBadge.icon} size={12} />
                      <span>{staff.approvalStatus}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {staff.approvalStatus === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            iconName="Check"
                            onClick={() => handleApprove(staff.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            iconName="X"
                            onClick={() => handleReject(staff.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => handleEdit(staff.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => handleViewDetails(staff.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredStaff.length} of {staffData.length} staff members</span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="ChevronLeft" disabled>
              Previous
            </Button>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-md">1</span>
            <Button variant="ghost" size="sm" iconName="ChevronRight" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagementTable;