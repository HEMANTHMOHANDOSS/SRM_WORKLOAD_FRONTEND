import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ActiveChoiceForms = () => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [formSubmissions, setFormSubmissions] = useState({});

  // Mock choice forms data
  const activeForms = [
    {
      id: 1,
      title: "Subject Preferences - Spring 2025",
      description: "Select your preferred subjects for the upcoming semester",
      deadline: "2025-01-30T23:59:59",
      status: "open",
      priority: "high",
      subjects: [
        { id: "cs401", name: "Advanced Algorithms", type: "Core", credits: 4, maxStudents: 40 },
        { id: "cs402", name: "Machine Learning", type: "Elective", credits: 3, maxStudents: 35 },
        { id: "cs403", name: "Web Development", type: "Elective", credits: 3, maxStudents: 30 },
        { id: "cs404", name: "Database Systems", type: "Core", credits: 4, maxStudents: 45 },
        { id: "cs405", name: "Software Engineering", type: "Core", credits: 3, maxStudents: 40 }
      ],
      constraints: {
        minCore: 2,
        maxElectives: 2,
        maxCredits: 12
      }
    },
    {
      id: 2,
      title: "Lab Coordination Preferences",
      description: "Choose labs you would like to coordinate",
      deadline: "2025-01-25T17:00:00",
      status: "open",
      priority: "medium",
      subjects: [
        { id: "lab201", name: "Data Structures Lab", type: "Lab", credits: 2, maxStudents: 25 },
        { id: "lab301", name: "Database Lab", type: "Lab", credits: 2, maxStudents: 25 },
        { id: "lab401", name: "Web Development Lab", type: "Lab", credits: 2, maxStudents: 20 }
      ],
      constraints: {
        maxLabs: 2
      }
    },
    {
      id: 3,
      title: "Time Slot Preferences",
      description: "Indicate your preferred teaching time slots",
      deadline: "2025-01-28T12:00:00",
      status: "draft",
      priority: "low",
      timeSlots: [
        { id: "morning", label: "Morning (8:00 AM - 12:00 PM)", preferred: false },
        { id: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)", preferred: false },
        { id: "evening", label: "Evening (4:00 PM - 8:00 PM)", preferred: false }
      ]
    }
  ];

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-success text-success-foreground';
      case 'draft':
        return 'bg-warning text-warning-foreground';
      case 'closed':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleSubjectSelection = (formId, subjectId, checked) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [subjectId]: checked
      }
    }));
  };

  const getSelectedCount = (formId, type = null) => {
    const selections = selectedSubjects[formId] || {};
    const form = activeForms.find(f => f.id === formId);
    
    if (!form || !form.subjects) return 0;
    
    return form.subjects.filter(subject => 
      selections[subject.id] && (type ? subject.type === type : true)
    ).length;
  };

  const getTotalCredits = (formId) => {
    const selections = selectedSubjects[formId] || {};
    const form = activeForms.find(f => f.id === formId);
    
    if (!form || !form.subjects) return 0;
    
    return form.subjects
      .filter(subject => selections[subject.id])
      .reduce((total, subject) => total + subject.credits, 0);
  };

  const validateConstraints = (formId) => {
    const form = activeForms.find(f => f.id === formId);
    if (!form || !form.constraints) return { valid: true, errors: [] };
    
    const errors = [];
    const constraints = form.constraints;
    
    if (constraints.minCore && getSelectedCount(formId, 'Core') < constraints.minCore) {
      errors.push(`Minimum ${constraints.minCore} core subjects required`);
    }
    
    if (constraints.maxElectives && getSelectedCount(formId, 'Elective') > constraints.maxElectives) {
      errors.push(`Maximum ${constraints.maxElectives} electives allowed`);
    }
    
    if (constraints.maxCredits && getTotalCredits(formId) > constraints.maxCredits) {
      errors.push(`Maximum ${constraints.maxCredits} credits allowed`);
    }
    
    if (constraints.maxLabs && getSelectedCount(formId, 'Lab') > constraints.maxLabs) {
      errors.push(`Maximum ${constraints.maxLabs} labs allowed`);
    }
    
    return { valid: errors.length === 0, errors };
  };

  const handleSubmitForm = (formId) => {
    const validation = validateConstraints(formId);
    
    if (!validation.valid) {
      alert(`Please fix the following issues:\n${validation.errors.join('\n')}`);
      return;
    }
    
    setFormSubmissions(prev => ({
      ...prev,
      [formId]: {
        submittedAt: new Date().toISOString(),
        selections: selectedSubjects[formId] || {}
      }
    }));
    
    console.log('Form submitted:', formId, selectedSubjects[formId]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Choice Forms</h2>
          <p className="text-sm text-muted-foreground">Complete your subject and preference selections</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {activeForms.filter(f => f.status === 'open').length} forms pending
          </span>
        </div>
      </div>

      {activeForms.map(form => {
        const isSubmitted = formSubmissions[form.id];
        const validation = validateConstraints(form.id);
        
        return (
          <div key={form.id} className="bg-card rounded-lg border border-border p-6">
            {/* Form Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{form.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                    {form.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(form.priority)}`}>
                    {form.priority} priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{getTimeRemaining(form.deadline)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Due: {new Date(form.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {isSubmitted && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Submitted</span>
                </div>
              )}
            </div>

            {/* Form Content */}
            {form.subjects && (
              <div className="space-y-4">
                {/* Constraints Info */}
                {form.constraints && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Selection Constraints:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {form.constraints.minCore && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Min Core Subjects:</span>
                          <span className={`font-medium ${getSelectedCount(form.id, 'Core') >= form.constraints.minCore ? 'text-success' : 'text-error'}`}>
                            {getSelectedCount(form.id, 'Core')} / {form.constraints.minCore}
                          </span>
                        </div>
                      )}
                      {form.constraints.maxElectives && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Max Electives:</span>
                          <span className={`font-medium ${getSelectedCount(form.id, 'Elective') <= form.constraints.maxElectives ? 'text-success' : 'text-error'}`}>
                            {getSelectedCount(form.id, 'Elective')} / {form.constraints.maxElectives}
                          </span>
                        </div>
                      )}
                      {form.constraints.maxCredits && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Credits:</span>
                          <span className={`font-medium ${getTotalCredits(form.id) <= form.constraints.maxCredits ? 'text-success' : 'text-error'}`}>
                            {getTotalCredits(form.id)} / {form.constraints.maxCredits}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subject Selection */}
                <div className="space-y-3">
                  {form.subjects.map(subject => (
                    <div key={subject.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedSubjects[form.id]?.[subject.id] || false}
                          onChange={(e) => handleSubjectSelection(form.id, subject.id, e.target.checked)}
                          disabled={isSubmitted || form.status !== 'open'}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-foreground">{subject.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subject.type === 'Core' ? 'bg-blue-100 text-blue-800' :
                              subject.type === 'Elective'? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {subject.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>{subject.credits} credits</span>
                            <span>Max {subject.maxStudents} students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Validation Errors */}
                {!validation.valid && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="AlertCircle" size={16} className="text-red-600" />
                      <span className="text-sm font-medium text-red-800">Validation Errors:</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Icon name="X" size={12} />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {isSubmitted ? (
                      <span>Submitted on {new Date(isSubmitted.submittedAt).toLocaleDateString()}</span>
                    ) : (
                      <span>Save your selections before the deadline</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubjects(prev => ({ ...prev, [form.id]: {} }))}
                      disabled={isSubmitted || form.status !== 'open'}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSubmitForm(form.id)}
                      disabled={isSubmitted || form.status !== 'open' || !validation.valid}
                      iconName="Send"
                      iconPosition="right"
                    >
                      {isSubmitted ? 'Submitted' : 'Submit Form'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Time Slot Preferences */}
            {form.timeSlots && (
              <div className="space-y-3">
                {form.timeSlots.map(slot => (
                  <div key={slot.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      checked={slot.preferred}
                      onChange={(e) => console.log('Time slot preference:', slot.id, e.target.checked)}
                      disabled={isSubmitted || form.status !== 'open'}
                    />
                    <span className="text-sm text-foreground">{slot.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {activeForms.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Active Forms</h3>
          <p className="text-sm text-muted-foreground">There are no choice forms available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveChoiceForms;