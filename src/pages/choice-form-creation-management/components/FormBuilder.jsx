import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormBuilder = ({ onFormUpdate, currentForm }) => {
  const [draggedField, setDraggedField] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const dragCounter = useRef(0);

  const fieldTypes = [
    { id: 'subject-checkbox', label: 'Subject Selection', icon: 'CheckSquare', description: 'Multiple subject checkboxes' },
    { id: 'constraint-selector', label: 'Constraint Selector', icon: 'Settings', description: 'Workload constraints' },
    { id: 'text-area', label: 'Text Area', icon: 'FileText', description: 'Long text input' },
    { id: 'file-upload', label: 'File Upload', icon: 'Upload', description: 'Document attachment' },
    { id: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', description: 'Single selection' },
    { id: 'radio-group', label: 'Radio Group', icon: 'Circle', description: 'Single choice' },
    { id: 'date-picker', label: 'Date Picker', icon: 'Calendar', description: 'Date selection' },
    { id: 'number-input', label: 'Number Input', icon: 'Hash', description: 'Numeric input' }
  ];

  const handleDragStart = (e, fieldType) => {
    setDraggedField(fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (draggedField) {
      const newField = {
        id: `field_${Date.now()}`,
        type: draggedField.id,
        label: draggedField.label,
        required: false,
        options: draggedField.id === 'subject-checkbox' ? [
          'Data Structures',
          'Algorithms',
          'Database Systems',
          'Computer Networks',
          'Operating Systems'
        ] : [],
        validation: {},
        settings: {}
      };

      const updatedForm = {
        ...currentForm,
        fields: [...(currentForm.fields || []), newField]
      };

      onFormUpdate(updatedForm);
      setDraggedField(null);
    }
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    const updatedFields = currentForm.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    onFormUpdate({
      ...currentForm,
      fields: updatedFields
    });
  };

  const handleFieldDelete = (fieldId) => {
    const updatedFields = currentForm.fields.filter(field => field.id !== fieldId);
    onFormUpdate({
      ...currentForm,
      fields: updatedFields
    });
    setSelectedField(null);
  };

  const moveField = (fieldId, direction) => {
    const fields = [...currentForm.fields];
    const fieldIndex = fields.findIndex(f => f.id === fieldId);
    
    if (direction === 'up' && fieldIndex > 0) {
      [fields[fieldIndex], fields[fieldIndex - 1]] = [fields[fieldIndex - 1], fields[fieldIndex]];
    } else if (direction === 'down' && fieldIndex < fields.length - 1) {
      [fields[fieldIndex], fields[fieldIndex + 1]] = [fields[fieldIndex + 1], fields[fieldIndex]];
    }

    onFormUpdate({
      ...currentForm,
      fields
    });
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center">
          <Icon name="Wrench" size={18} className="mr-2" />
          Form Builder
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop fields to build your form
        </p>
      </div>

      <div className="flex-1 flex">
        {/* Field Types Panel */}
        <div className="w-64 border-r border-border p-4 overflow-y-auto">
          <h4 className="font-medium text-foreground mb-3">Available Fields</h4>
          <div className="space-y-2">
            {fieldTypes.map((fieldType) => (
              <div
                key={fieldType.id}
                draggable
                onDragStart={(e) => handleDragStart(e, fieldType)}
                className="p-3 border border-border rounded-lg cursor-grab hover:bg-muted transition-smooth active:cursor-grabbing"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={fieldType.icon} size={16} className="text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {fieldType.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {fieldType.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Area */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {currentForm.fields && currentForm.fields.length > 0 ? (
              <div className="space-y-3">
                {currentForm.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                      selectedField?.id === field.id
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleFieldSelect(field)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={fieldTypes.find(ft => ft.id === field.type)?.icon || 'Square'} 
                          size={16} 
                          className="text-primary" 
                        />
                        <span className="font-medium text-foreground">{field.label}</span>
                        {field.required && (
                          <span className="text-error text-sm">*</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <Icon name="ChevronUp" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'down');
                          }}
                          disabled={index === currentForm.fields.length - 1}
                        >
                          <Icon name="ChevronDown" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFieldDelete(field.id);
                          }}
                        >
                          <Icon name="Trash2" size={14} className="text-error" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Field Preview */}
                    <div className="text-sm text-muted-foreground">
                      {field.type === 'subject-checkbox' && (
                        <div className="space-y-1">
                          {field.options.slice(0, 3).map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-4 h-4 border border-border rounded"></div>
                              <span>{option}</span>
                            </div>
                          ))}
                          {field.options.length > 3 && (
                            <span className="text-xs">+{field.options.length - 3} more</span>
                          )}
                        </div>
                      )}
                      {field.type === 'text-area' && (
                        <div className="w-full h-16 border border-border rounded bg-muted"></div>
                      )}
                      {field.type === 'dropdown' && (
                        <div className="w-full h-8 border border-border rounded bg-muted flex items-center px-2">
                          <span className="text-muted-foreground">Select option...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <Icon name="MousePointer2" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium text-foreground mb-2">Drop fields here</h4>
                  <p className="text-sm text-muted-foreground">
                    Drag field types from the left panel to start building your form
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Field Configuration Panel */}
        {selectedField && (
          <div className="w-80 border-l border-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Field Settings</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedField(null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Field Label"
                value={selectedField.label}
                onChange={(e) => handleFieldUpdate(selectedField.id, { label: e.target.value })}
              />

              <Checkbox
                label="Required Field"
                checked={selectedField.required}
                onChange={(e) => handleFieldUpdate(selectedField.id, { required: e.target.checked })}
              />

              {selectedField.type === 'subject-checkbox' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject Options
                  </label>
                  <div className="space-y-2">
                    {selectedField.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...selectedField.options];
                            newOptions[index] = e.target.value;
                            handleFieldUpdate(selectedField.id, { options: newOptions });
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newOptions = selectedField.options.filter((_, i) => i !== index);
                            handleFieldUpdate(selectedField.id, { options: newOptions });
                          }}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...selectedField.options, 'New Subject'];
                        handleFieldUpdate(selectedField.id, { options: newOptions });
                      }}
                    >
                      <Icon name="Plus" size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {selectedField.type === 'text-area' && (
                <div>
                  <Input
                    label="Placeholder Text"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { placeholder: e.target.value })}
                  />
                  <Input
                    label="Maximum Characters"
                    type="number"
                    value={selectedField.maxLength || ''}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { maxLength: parseInt(e.target.value) || null })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;