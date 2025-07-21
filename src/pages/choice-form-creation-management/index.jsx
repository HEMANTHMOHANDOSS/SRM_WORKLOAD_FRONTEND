import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';

// Import components
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import FormSettings from './components/FormSettings';
import PublishedFormsTable from './components/PublishedFormsTable';
import SubmissionTracker from './components/SubmissionTracker';
import FormTemplates from './components/FormTemplates';

const ChoiceFormCreationManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('builder');
  const [currentForm, setCurrentForm] = useState({
    id: null,
    title: '',
    description: '',
    fields: [],
    settings: {}
  });

  // Mock user data
  const userData = {
    role: 'department-admin',
    name: 'Dr. Michael Rodriguez',
    department: 'Computer Science & Engineering'
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      message: "New form submission received for \'Subject Selection - Fall 2024'",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      message: "Form \'Workload Preferences\' will close in 2 days",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      message: "15 staff members completed the availability form",
      time: "3 hours ago",
      read: true
    }
  ];

  const viewOptions = [
    { id: 'builder', label: 'Form Builder', icon: 'Wrench', description: 'Create and edit forms' },
    { id: 'templates', label: 'Templates', icon: 'Layout', description: 'Use pre-built templates' },
    { id: 'published', label: 'Published Forms', icon: 'FileText', description: 'Manage active forms' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3', description: 'Track submissions' }
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'Building2' },
    { label: 'Choice Form Management', path: '/choice-form-creation-management', icon: 'FileText' }
  ];

  useEffect(() => {
    // Auto-save form changes
    const saveTimer = setTimeout(() => {
      if (currentForm.title || currentForm.fields.length > 0) {
        console.log('Auto-saving form...', currentForm);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [currentForm]);

  const handleFormUpdate = (updatedForm) => {
    setCurrentForm(updatedForm);
  };

  const handleUseTemplate = (template) => {
    const newForm = {
      id: `form_${Date.now()}`,
      title: template.name,
      description: template.description,
      fields: template.features.map((feature, index) => ({
        id: `field_${index}`,
        type: 'subject-checkbox',
        label: feature,
        required: index === 0,
        options: ['Option 1', 'Option 2', 'Option 3']
      })),
      settings: {
        category: template.category,
        estimatedTime: template.estimatedTime
      }
    };
    
    setCurrentForm(newForm);
    setActiveView('builder');
  };

  const handleEditForm = (form) => {
    setCurrentForm({
      id: form.id,
      title: form.title,
      description: form.description || '',
      fields: form.fields || [],
      settings: form.settings || {}
    });
    setActiveView('builder');
  };

  const handleDuplicateForm = (form) => {
    const duplicatedForm = {
      ...form,
      id: `${form.id}_copy_${Date.now()}`,
      title: `${form.title} (Copy)`,
      status: 'draft'
    };
    
    setCurrentForm(duplicatedForm);
    setActiveView('builder');
  };

  const handlePublishForm = () => {
    if (!currentForm.title || currentForm.fields.length === 0) {
      alert('Please add a title and at least one field before publishing.');
      return;
    }
    
    console.log('Publishing form:', currentForm);
    alert('Form published successfully!');
    setActiveView('published');
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'builder':
        return (
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Form Builder - Left Section */}
            <div className="col-span-5 h-full">
              <FormBuilder 
                currentForm={currentForm}
                onFormUpdate={handleFormUpdate}
              />
            </div>
            
            {/* Form Preview - Right Section */}
            <div className="col-span-7 h-full">
              <div className="grid grid-rows-2 gap-4 h-full">
                <div className="row-span-1">
                  <FormPreview 
                    form={currentForm}
                    sampleData={{}}
                  />
                </div>
                <div className="row-span-1">
                  <FormSettings 
                    form={currentForm}
                    onFormUpdate={handleFormUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'templates':
        return (
          <FormTemplates onUseTemplate={handleUseTemplate} />
        );
        
      case 'published':
        return (
          <PublishedFormsTable 
            onEditForm={handleEditForm}
            onDuplicateForm={handleDuplicateForm}
          />
        );
        
      case 'analytics':
        return (
          <SubmissionTracker />
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">Select a view</h3>
              <p className="text-sm text-muted-foreground">
                Choose from the options above to get started
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader 
        userRole={userData.role}
        userName={userData.name}
        notifications={notifications}
      />

      {/* Sidebar */}
      <NavigationSidebar
        userRole={userData.role}
        currentPath="/choice-form-creation-management"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className={`transition-layout ${sidebarOpen ? 'ml-64' : 'ml-16'} pt-16`}>
        <div className="p-6 h-[calc(100vh-4rem)]">
          {/* Breadcrumb */}
          <BreadcrumbContext 
            items={breadcrumbItems}
            userRole={userData.role}
          />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="FileText" size={28} className="mr-3" />
                Choice Form Creation & Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Create, manage, and track dynamic forms for staff subject selection and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <StatusIndicator 
                connectionStatus="online"
                syncStatus="synced"
                lastSyncTime={new Date()}
                pendingOperations={0}
                systemHealth="healthy"
              />
              
              {activeView === 'builder' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Save" size={14} className="mr-1" />
                    Save Draft
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handlePublishForm}
                  >
                    <Icon name="Send" size={14} className="mr-1" />
                    Publish Form
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* View Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveView(option.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                  activeView === option.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
                title={option.description}
              >
                <Icon name={option.icon} size={16} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-card rounded-lg border border-border h-[calc(100vh-16rem)] overflow-hidden">
            {renderMainContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChoiceFormCreationManagement;