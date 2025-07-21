import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConstraintPanel = ({ constraints, onConstraintsChange, onGenerateTimetable, isGenerating }) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    workload: true,
    timing: false,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConstraintChange = (key, value) => {
    onConstraintsChange({
      ...constraints,
      [key]: value
    });
  };

  const workingDaysOptions = [
    { value: 5, label: '5 Days (Mon-Fri)' },
    { value: 6, label: '6 Days (Mon-Sat)' }
  ];

  const classDurationOptions = [
    { value: 45, label: '45 minutes' },
    { value: 50, label: '50 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' }
  ];

  const breakDurationOptions = [
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center">
          <Icon name="Settings" size={18} className="mr-2" />
          Timetable Constraints
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Configure generation parameters</p>
      </div>

      <div className="p-4 space-y-4">
        {/* General Constraints */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('general')}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-smooth"
          >
            <span>General Settings</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections.general ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.general && (
            <div className="space-y-3 pl-4">
              <Select
                label="Working Days"
                options={workingDaysOptions}
                value={constraints.workingDays}
                onChange={(value) => handleConstraintChange('workingDays', value)}
              />

              <Select
                label="Class Duration"
                options={classDurationOptions}
                value={constraints.classDuration}
                onChange={(value) => handleConstraintChange('classDuration', value)}
              />

              <Select
                label="Break Duration"
                options={breakDurationOptions}
                value={constraints.breakDuration}
                onChange={(value) => handleConstraintChange('breakDuration', value)}
              />

              <Input
                label="Classes per Day"
                type="number"
                min="4"
                max="10"
                value={constraints.classesPerDay}
                onChange={(e) => handleConstraintChange('classesPerDay', parseInt(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* Workload Constraints */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('workload')}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-smooth"
          >
            <span>Workload Distribution</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections.workload ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.workload && (
            <div className="space-y-3 pl-4">
              <Input
                label="Max Labs per Day"
                type="number"
                min="0"
                max="4"
                value={constraints.maxLabsPerDay}
                onChange={(e) => handleConstraintChange('maxLabsPerDay', parseInt(e.target.value))}
                description="Maximum lab sessions per day"
              />

              <Input
                label="Max Core Subjects per Day"
                type="number"
                min="1"
                max="6"
                value={constraints.maxCorePerDay}
                onChange={(e) => handleConstraintChange('maxCorePerDay', parseInt(e.target.value))}
                description="Maximum core subjects per day"
              />

              <Input
                label="Max Electives per Day"
                type="number"
                min="0"
                max="3"
                value={constraints.maxElectivesPerDay}
                onChange={(e) => handleConstraintChange('maxElectivesPerDay', parseInt(e.target.value))}
                description="Maximum elective subjects per day"
              />

              <Checkbox
                label="Require Dual Staff for Labs"
                checked={constraints.dualStaffLabs}
                onChange={(e) => handleConstraintChange('dualStaffLabs', e.target.checked)}
                description="Assign two instructors for lab sessions"
              />
            </div>
          )}
        </div>

        {/* Timing Constraints */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('timing')}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-smooth"
          >
            <span>Timing Preferences</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections.timing ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.timing && (
            <div className="space-y-3 pl-4">
              <Input
                label="Start Time"
                type="time"
                value={constraints.startTime}
                onChange={(e) => handleConstraintChange('startTime', e.target.value)}
              />

              <Input
                label="End Time"
                type="time"
                value={constraints.endTime}
                onChange={(e) => handleConstraintChange('endTime', e.target.value)}
              />

              <Checkbox
                label="Avoid Early Morning Labs"
                checked={constraints.avoidEarlyLabs}
                onChange={(e) => handleConstraintChange('avoidEarlyLabs', e.target.checked)}
                description="Schedule labs after 10:00 AM"
              />

              <Checkbox
                label="Prefer Consecutive Classes"
                checked={constraints.consecutiveClasses}
                onChange={(e) => handleConstraintChange('consecutiveClasses', e.target.checked)}
                description="Group same subject classes together"
              />
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-smooth"
          >
            <span>Advanced Options</span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${expandedSections.advanced ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.advanced && (
            <div className="space-y-3 pl-4">
              <Checkbox
                label="Auto Resolve Conflicts"
                checked={constraints.autoResolveConflicts}
                onChange={(e) => handleConstraintChange('autoResolveConflicts', e.target.checked)}
                description="Automatically resolve scheduling conflicts"
              />

              <Checkbox
                label="Optimize for Faculty Preferences"
                checked={constraints.optimizeFacultyPrefs}
                onChange={(e) => handleConstraintChange('optimizeFacultyPrefs', e.target.checked)}
                description="Consider faculty availability preferences"
              />

              <Checkbox
                label="Balance Workload"
                checked={constraints.balanceWorkload}
                onChange={(e) => handleConstraintChange('balanceWorkload', e.target.checked)}
                description="Distribute teaching load evenly"
              />

              <Input
                label="Generation Iterations"
                type="number"
                min="1"
                max="10"
                value={constraints.iterations}
                onChange={(e) => handleConstraintChange('iterations', parseInt(e.target.value))}
                description="Number of optimization attempts"
              />
            </div>
          )}
        </div>

        {/* AI Generation Controls */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="Sparkles" size={16} className="mr-2 text-primary" />
              AI Generation
            </h4>

            <Button
              variant="default"
              fullWidth
              loading={isGenerating}
              iconName="Wand2"
              iconPosition="left"
              onClick={onGenerateTimetable}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Timetable...' : 'Generate AI Timetable'}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Analyzing constraints and generating optimal schedule...
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RotateCcw"
                onClick={() => onConstraintsChange({
                  workingDays: 5,
                  classDuration: 50,
                  breakDuration: 15,
                  classesPerDay: 7,
                  maxLabsPerDay: 2,
                  maxCorePerDay: 4,
                  maxElectivesPerDay: 2,
                  dualStaffLabs: true,
                  startTime: '09:00',
                  endTime: '17:00',
                  avoidEarlyLabs: true,
                  consecutiveClasses: false,
                  autoResolveConflicts: true,
                  optimizeFacultyPrefs: true,
                  balanceWorkload: true,
                  iterations: 3
                })}
              >
                Reset
              </Button>

              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                onClick={() => console.log('Save constraints')}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstraintPanel;