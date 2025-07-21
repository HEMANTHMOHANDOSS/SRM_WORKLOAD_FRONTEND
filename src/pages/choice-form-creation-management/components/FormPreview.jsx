import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormPreview = ({ form, sampleData }) => {
  const renderField = (field) => {
    switch (field.type) {
      case 'subject-checkbox':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {field.options.map((option, index) => (
                <Checkbox
                  key={index}
                  label={option}
                  checked={index < 2} // Mock some selections
                  onChange={() => {}} // Preview only
                />
              ))}
            </div>
          </div>
        );

      case 'constraint-selector':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Hours/Week"
                type="number"
                value="20"
                disabled
              />
              <Input
                label="Preferred Days"
                value="Mon, Wed, Fri"
                disabled
              />
            </div>
          </div>
        );

      case 'text-area':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder={field.placeholder || "Enter your response..."}
              value="This is a sample response for preview purposes."
              disabled
            />
          </div>
        );

      case 'file-upload':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX up to 10MB
              </p>
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                disabled
              >
                <option>Select an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <Icon name="ChevronDown" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        );

      case 'radio-group':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    className="w-4 h-4 text-primary border-border focus:ring-ring"
                    checked={index === 0}
                    disabled
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date-picker':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <Input
              type="date"
              value="2024-07-21"
              disabled
            />
          </div>
        );

      case 'number-input':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <Input
              type="number"
              value="42"
              disabled
            />
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <Input
              value="Sample text"
              disabled
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center">
              <Icon name="Eye" size={18} className="mr-2" />
              Live Preview
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              How staff members will see this form
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {form.title || 'Untitled Form'}
                </h1>
                <p className="text-muted-foreground">
                  Department of Computer Science & Engineering
                </p>
              </div>
            </div>
            
            {form.description && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground">{form.description}</p>
              </div>
            )}

            {/* Auto-filled Staff Info */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="font-medium text-foreground mb-3 flex items-center">
                <Icon name="User" size={16} className="mr-2" />
                Auto-filled Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Staff Name:</span>
                  <span className="ml-2 font-medium text-foreground">Dr. Sarah Johnson</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="ml-2 font-medium text-foreground">CSE001</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <span className="ml-2 font-medium text-foreground">Computer Science</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="ml-2 font-medium text-foreground">8 years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          {form.fields && form.fields.length > 0 ? (
            <div className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg bg-card">
                  {renderField(field)}
                </div>
              ))}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Estimated completion time: 5-10 minutes
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    Save Draft
                  </Button>
                  <Button variant="default">
                    Submit Form
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">No fields added yet</h3>
              <p className="text-sm text-muted-foreground">
                Add fields from the form builder to see the preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Form ID: {form.id || 'FORM_001'}</span>
            <span>Version: 1.0</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} />
            <span>Secure Form</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;