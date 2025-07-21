import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const TimetableGenerationPanel = () => {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const semesterOptions = [
    { value: "fall-2024", label: "Fall 2024" },
    { value: "spring-2025", label: "Spring 2025" },
    { value: "summer-2025", label: "Summer 2025" }
  ];

  const yearOptions = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" }
  ];

  const constraints = [
    { id: 1, name: "Max Labs per Day", value: "2", icon: "FlaskConical" },
    { id: 2, name: "Core Classes per Day", value: "4", icon: "BookOpen" },
    { id: 3, name: "Break Duration", value: "15 min", icon: "Clock" },
    { id: 4, name: "Working Days", value: "5", icon: "Calendar" }
  ];

  const recentGenerations = [
    {
      id: 1,
      semester: "Fall 2024",
      year: "3rd Year",
      status: "completed",
      timestamp: "2024-07-20 14:30",
      conflicts: 0
    },
    {
      id: 2,
      semester: "Fall 2024",
      year: "2nd Year",
      status: "in-progress",
      timestamp: "2024-07-21 10:15",
      conflicts: 2
    },
    {
      id: 3,
      semester: "Spring 2025",
      year: "1st Year",
      status: "failed",
      timestamp: "2024-07-19 16:45",
      conflicts: 5
    }
  ];

  const handleGenerate = async () => {
    if (!selectedSemester || !selectedYear) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      completed: { icon: 'CheckCircle', color: 'text-success' },
      'in-progress': { icon: 'Loader2', color: 'text-warning animate-spin' },
      failed: { icon: 'XCircle', color: 'text-error' }
    };
    return statusMap[status] || statusMap.completed;
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      completed: 'bg-success/10 text-success',
      'in-progress': 'bg-warning/10 text-warning',
      failed: 'bg-error/10 text-error'
    };
    return badgeMap[status] || badgeMap.completed;
  };

  return (
    <div className="space-y-6">
      {/* AI Timetable Generation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Bot" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">AI Timetable Generation</h3>
        </div>

        <div className="space-y-4">
          <Select
            label="Semester"
            options={semesterOptions}
            value={selectedSemester}
            onChange={setSelectedSemester}
            placeholder="Select semester"
          />

          <Select
            label="Academic Year"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Select year"
          />

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generating timetable...</span>
                <span className="font-medium text-foreground">{generationProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            variant="default"
            fullWidth
            loading={isGenerating}
            disabled={!selectedSemester || !selectedYear}
            iconName="Sparkles"
            iconPosition="left"
            onClick={handleGenerate}
          >
            {isGenerating ? 'Generating...' : 'Generate Timetable'}
          </Button>
        </div>
      </div>

      {/* Constraints */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Constraints</h3>
        <div className="grid grid-cols-2 gap-3">
          {constraints.map((constraint) => (
            <div key={constraint.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name={constraint.icon} size={16} className="text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{constraint.name}</p>
                <p className="text-xs text-muted-foreground">{constraint.value}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4" iconName="Settings">
          Configure
        </Button>
      </div>

      {/* Recent Generations */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Generations</h3>
        <div className="space-y-3">
          {recentGenerations.map((generation) => {
            const statusInfo = getStatusIcon(generation.status);
            return (
              <div key={generation.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={statusInfo.icon} size={16} className={statusInfo.color} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {generation.semester} - {generation.year}
                    </p>
                    <p className="text-xs text-muted-foreground">{generation.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {generation.conflicts > 0 && (
                    <span className="text-xs text-error font-medium">
                      {generation.conflicts} conflicts
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(generation.status)}`}>
                    {generation.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" fullWidth iconName="Calendar" iconPosition="left">
            View All Timetables
          </Button>
          <Button variant="outline" fullWidth iconName="Edit" iconPosition="left">
            Manual Edit Mode
          </Button>
          <Button variant="outline" fullWidth iconName="Download" iconPosition="left">
            Export Timetables
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerationPanel;