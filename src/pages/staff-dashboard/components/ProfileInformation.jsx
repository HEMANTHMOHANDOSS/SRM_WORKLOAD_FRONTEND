import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProfileInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@srm.edu.in",
    phone: "+91 9876543210",
    employeeId: "SRM2023001",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    qualification: "Ph.D. in Computer Science",
    specialization: "Machine Learning, Data Mining",
    experience: "8 years",
    joiningDate: "2019-08-15",
    officeRoom: "Block-A, Room 301",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    console.log('Profile updated:', tempData);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const profileSections = [
    {
      title: "Personal Information",
      icon: "User",
      fields: [
        { key: "firstName", label: "First Name", type: "text", editable: true },
        { key: "lastName", label: "Last Name", type: "text", editable: true },
        { key: "email", label: "Email Address", type: "email", editable: true },
        { key: "phone", label: "Phone Number", type: "tel", editable: true }
      ]
    },
    {
      title: "Professional Details",
      icon: "Briefcase",
      fields: [
        { key: "employeeId", label: "Employee ID", type: "text", editable: false },
        { key: "department", label: "Department", type: "text", editable: false },
        { key: "designation", label: "Designation", type: "text", editable: false },
        { key: "qualification", label: "Qualification", type: "text", editable: true },
        { key: "specialization", label: "Specialization", type: "text", editable: true },
        { key: "experience", label: "Experience", type: "text", editable: true }
      ]
    },
    {
      title: "Institutional Details",
      icon: "Building2",
      fields: [
        { key: "joiningDate", label: "Joining Date", type: "date", editable: false },
        { key: "officeRoom", label: "Office Room", type: "text", editable: true }
      ]
    }
  ];

  const quickActions = [
    { label: "Change Password", icon: "Lock", action: () => console.log('Change password') },
    { label: "Download CV", icon: "Download", action: () => console.log('Download CV') },
    { label: "Update Documents", icon: "FileText", action: () => console.log('Update documents') },
    { label: "View Teaching History", icon: "History", action: () => console.log('View history') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground">Manage your personal and professional details</p>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start space-x-6 mb-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
              <Image
                src={isEditing ? tempData.profileImage : profileData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-smooth">
                <Icon name="Camera" size={12} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-foreground">
                {isEditing ? `${tempData.firstName} ${tempData.lastName}` : `${profileData.firstName} ${profileData.lastName}`}
              </h3>
              <span className="px-3 py-1 bg-success text-success-foreground rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <p className="text-lg text-muted-foreground mb-1">
              {isEditing ? tempData.designation : profileData.designation}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {isEditing ? tempData.department : profileData.department}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Mail" size={14} />
                <span>{isEditing ? tempData.email : profileData.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Phone" size={14} />
                <span>{isEditing ? tempData.phone : profileData.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{isEditing ? tempData.officeRoom : profileData.officeRoom}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {profileSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border-t border-border pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name={section.icon} size={18} className="text-primary" />
                <h4 className="text-lg font-semibold text-foreground">{section.title}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    {isEditing && field.editable ? (
                      <Input
                        label={field.label}
                        type={field.type}
                        value={tempData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">
                          {field.label}
                        </label>
                        <div className="text-sm text-foreground p-2 bg-muted rounded-md">
                          {field.type === 'date' 
                            ? new Date(profileData[field.key]).toLocaleDateString()
                            : profileData[field.key]
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
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

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Profile Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Profile updated", time: "2 hours ago", icon: "Edit" },
            { action: "Password changed", time: "1 week ago", icon: "Lock" },
            { action: "Documents uploaded", time: "2 weeks ago", icon: "Upload" },
            { action: "Profile created", time: "6 months ago", icon: "UserPlus" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="p-1 bg-primary/10 text-primary rounded-md">
                <Icon name={activity.icon} size={14} />
              </div>
              <div className="flex-1">
                <span className="text-sm text-foreground">{activity.action}</span>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;