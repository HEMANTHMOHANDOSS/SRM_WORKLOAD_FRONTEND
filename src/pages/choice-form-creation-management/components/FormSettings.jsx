import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormSettings = ({ form, onFormUpdate }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const departmentOptions = [
    { value: 'cse', label: 'Computer Science & Engineering' },
    { value: 'ece', label: 'Electronics & Communication' },
    { value: 'mech', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'eee', label: 'Electrical & Electronics' }
  ];

  const staffRoleOptions = [
    { value: 'all', label: 'All Staff Members' },
    { value: 'professor', label: 'Professors Only' },
    { value: 'associate', label: 'Associate Professors' },
    { value: 'assistant', label: 'Assistant Professors' },
    { value: 'lecturer', label: 'Lecturers' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'scheduling', label: 'Scheduling', icon: 'Calendar' },
    { id: 'targeting', label: 'Targeting', icon: 'Users' },
    { id: 'advanced', label: 'Advanced', icon: 'Settings' }
  ];

  const handleInputChange = (field, value) => {
    onFormUpdate({
      ...form,
      [field]: value
    });
  };

  const renderBasicSettings = () => (
    <div className="space-y-4">
      <Input
        label="Form Title"
        value={form.title || ''}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Enter form title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Form Description
        </label>
        <textarea
          className="w-full h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          value={form.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the purpose of this form..."
        />
      </div>

      <Select
        label="Form Category"
        options={[
          { value: 'subject-selection', label: 'Subject Selection' },
          { value: 'workload-preference', label: 'Workload Preference' },
          { value: 'availability', label: 'Availability Form' },
          { value: 'feedback', label: 'Feedback Form' },
          { value: 'other', label: 'Other' }
        ]}
        value={form.category || ''}
        onChange={(value) => handleInputChange('category', value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Form Version"
          value={form.version || '1.0'}
          onChange={(e) => handleInputChange('version', e.target.value)}
        />
        <Select
          label="Priority Level"
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
            { value: 'urgent', label: 'Urgent' }
          ]}
          value={form.priority || 'medium'}
          onChange={(value) => handleInputChange('priority', value)}
        />
      </div>
    </div>
  );

  const renderSchedulingSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Opening Date"
          type="datetime-local"
          value={form.openingDate || ''}
          onChange={(e) => handleInputChange('openingDate', e.target.value)}
        />
        <Input
          label="Closing Date"
          type="datetime-local"
          value={form.closingDate || ''}
          onChange={(e) => handleInputChange('closingDate', e.target.value)}
        />
      </div>

      <Checkbox
        label="Auto-close form after deadline"
        checked={form.autoClose || false}
        onChange={(e) => handleInputChange('autoClose', e.target.checked)}
        description="Automatically prevent new submissions after closing date"
      />

      <Checkbox
        label="Send reminder notifications"
        checked={form.sendReminders || false}
        onChange={(e) => handleInputChange('sendReminders', e.target.checked)}
        description="Send email reminders to staff who haven't submitted"
      />

      {form.sendReminders && (
        <div className="ml-6 space-y-3">
          <Input
            label="First Reminder (days before deadline)"
            type="number"
            value={form.firstReminder || '3'}
            onChange={(e) => handleInputChange('firstReminder', e.target.value)}
          />
          <Input
            label="Final Reminder (days before deadline)"
            type="number"
            value={form.finalReminder || '1'}
            onChange={(e) => handleInputChange('finalReminder', e.target.value)}
          />
        </div>
      )}

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Clock" size={16} className="mr-2" />
          Schedule Preview
        </h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Opens: {form.openingDate ? new Date(form.openingDate).toLocaleString() : 'Not set'}</p>
          <p>Closes: {form.closingDate ? new Date(form.closingDate).toLocaleString() : 'Not set'}</p>
          <p>Duration: {form.openingDate && form.closingDate ? 
            Math.ceil((new Date(form.closingDate) - new Date(form.openingDate)) / (1000 * 60 * 60 * 24)) + 'days' : 'Not calculated'
          }</p>
        </div>
      </div>
    </div>
  );

  const renderTargetingSettings = () => (
    <div className="space-y-4">
      <Select
        label="Target Department"
        options={departmentOptions}
        value={form.targetDepartment || ''}
        onChange={(value) => handleInputChange('targetDepartment', value)}
        multiple
        searchable
      />

      <Select
        label="Target Staff Roles"
        options={staffRoleOptions}
        value={form.targetRoles || []}
        onChange={(value) => handleInputChange('targetRoles', value)}
        multiple
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Specific Staff Members (Optional)
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Enter staff email or ID"
            />
            <Button variant="outline" size="sm">
              <Icon name="Plus" size={14} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Users" size={16} className="mr-2" />
          Estimated Recipients
        </h4>
        <div className="text-sm text-muted-foreground">
          <p>Based on current targeting settings:</p>
          <p className="font-medium text-foreground mt-1">~45 staff members</p>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-4">
      <Checkbox
        label="Allow draft submissions"
        checked={form.allowDrafts || false}
        onChange={(e) => handleInputChange('allowDrafts', e.target.checked)}
        description="Staff can save incomplete forms and return later"
      />

      <Checkbox
        label="Allow multiple submissions"
        checked={form.allowMultiple || false}
        onChange={(e) => handleInputChange('allowMultiple', e.target.checked)}
        description="Staff can submit the form multiple times"
      />

      <Checkbox
        label="Require authentication"
        checked={form.requireAuth || true}
        onChange={(e) => handleInputChange('requireAuth', e.target.checked)}
        description="Only authenticated staff can access the form"
      />

      <Checkbox
        label="Anonymous submissions"
        checked={form.anonymous || false}
        onChange={(e) => handleInputChange('anonymous', e.target.checked)}
        description="Hide staff identity in responses"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Maximum Submissions"
          type="number"
          value={form.maxSubmissions || ''}
          onChange={(e) => handleInputChange('maxSubmissions', e.target.value)}
          placeholder="Leave empty for unlimited"
        />
        <Input
          label="Submission Timeout (minutes)"
          type="number"
          value={form.submissionTimeout || '30'}
          onChange={(e) => handleInputChange('submissionTimeout', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Success Message
        </label>
        <textarea
          className="w-full h-20 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          value={form.successMessage || ''}
          onChange={(e) => handleInputChange('successMessage', e.target.value)}
          placeholder="Thank you for your submission..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Custom CSS (Advanced)
        </label>
        <textarea
          className="w-full h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-xs"
          value={form.customCSS || ''}
          onChange={(e) => handleInputChange('customCSS', e.target.value)}
          placeholder="/* Custom styles for this form */"
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center">
          <Icon name="Settings" size={18} className="mr-2" />
          Form Settings
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure form behavior and targeting
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-t-md transition-smooth ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'basic' && renderBasicSettings()}
        {activeTab === 'scheduling' && renderSchedulingSettings()}
        {activeTab === 'targeting' && renderTargetingSettings()}
        {activeTab === 'advanced' && renderAdvancedSettings()}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last saved: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Reset to Default
            </Button>
            <Button variant="default" size="sm">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;