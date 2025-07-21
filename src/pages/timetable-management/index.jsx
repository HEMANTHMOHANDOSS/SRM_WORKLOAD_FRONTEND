import React, { useState, useEffect } from 'react';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbContext from '../../components/ui/BreadcrumbContext';
import StatusIndicator from '../../components/ui/StatusIndicator';
import ConstraintPanel from './components/ConstraintPanel';
import TimetableGrid from './components/TimetableGrid';
import ViewSwitcher from './components/ViewSwitcher';
import SubjectPool from './components/SubjectPool';
import AnalyticsPanel from './components/AnalyticsPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TimetableManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('department');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [activePanel, setActivePanel] = useState('constraints');

  // Mock user data
  const currentUser = {
    role: 'department-admin',
    name: 'Dr. Sarah Johnson',
    department: 'Computer Science'
  };

  // Mock notifications
  const notifications = [
    { message: "Timetable generation completed successfully", time: "2 minutes ago", read: false },
    { message: "3 scheduling conflicts detected", time: "15 minutes ago", read: false },
    { message: "Staff availability updated", time: "1 hour ago", read: true }
  ];

  // Mock constraints
  const [constraints, setConstraints] = useState({
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
  });

  // Mock timetable data
  const [timetableData, setTimetableData] = useState({
    workingDays: 5,
    schedule: {
      'Monday': {
        '09:00 - 09:50': {
          id: '1',
          subject: 'Data Structures',
          code: 'CS201',
          instructor: 'Dr. Smith',
          room: 'CS-101',
          type: 'core',
          duration: 50
        },
        '09:50 - 10:40': {
          id: '2',
          subject: 'Database Systems',
          code: 'CS301',
          instructor: 'Prof. Johnson',
          room: 'CS-102',
          type: 'core',
          duration: 50
        },
        '11:45 - 12:35': {
          id: '3',
          subject: 'AI Lab',
          code: 'CS401L',
          instructor: 'Dr. Williams',
          room: 'Lab-1',
          type: 'lab',
          duration: 50,
          dualStaff: true
        }
      },
      'Tuesday': {
        '09:00 - 09:50': {
          id: '4',
          subject: 'Machine Learning',
          code: 'CS402',
          instructor: 'Dr. Brown',
          room: 'CS-103',
          type: 'elective',
          duration: 50
        },
        '15:00 - 15:50': {
          id: '5',
          subject: 'Software Engineering',
          code: 'CS302',
          instructor: 'Prof. Davis',
          room: 'CS-104',
          type: 'core',
          duration: 50
        }
      }
    }
  });

  // Mock subjects pool
  const subjects = [
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      type: 'core',
      credits: 4,
      hoursPerWeek: 4,
      instructor: 'Dr. Smith',
      description: 'Fundamental data structures and algorithmic techniques',
      constraints: ['No Friday slots', 'Prefer morning sessions']
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS301',
      type: 'core',
      credits: 3,
      hoursPerWeek: 3,
      instructor: 'Prof. Johnson',
      description: 'Relational database design and SQL programming'
    },
    {
      id: '3',
      name: 'Artificial Intelligence Lab',
      code: 'CS401L',
      type: 'lab',
      credits: 2,
      hoursPerWeek: 4,
      instructor: 'Dr. Williams',
      description: 'Hands-on AI programming and implementation',
      constraints: ['Requires dual staff', 'Lab equipment needed']
    },
    {
      id: '4',
      name: 'Machine Learning',
      code: 'CS402',
      type: 'elective',
      credits: 3,
      hoursPerWeek: 3,
      instructor: 'Dr. Brown',
      description: 'Introduction to machine learning algorithms and applications'
    },
    {
      id: '5',
      name: 'Software Engineering',
      code: 'CS302',
      type: 'core',
      credits: 4,
      hoursPerWeek: 4,
      instructor: 'Prof. Davis',
      description: 'Software development lifecycle and project management'
    },
    {
      id: '6',
      name: 'Web Development Tutorial',
      code: 'CS203T',
      type: 'tutorial',
      credits: 1,
      hoursPerWeek: 2,
      instructor: 'Dr. Wilson',
      description: 'Practical web development skills and frameworks'
    }
  ];

  // Mock conflicts
  const conflicts = [
    { day: 'Monday', timeSlot: '11:45 - 12:35', type: 'room_conflict', message: 'Lab-1 double booked' }
  ];

  // View counts for switcher
  const viewCounts = {
    department: 1,
    class: 8,
    staff: 12,
    classroom: 15,
    lab: 5
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Department Dashboard', path: '/department-admin-dashboard', icon: 'Building2' },
    { label: 'Timetable Management', path: '/timetable-management', icon: 'Calendar' }
  ];

  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      console.log('Generating timetable with constraints:', constraints);
      console.log('Selected subjects:', selectedSubjects);
      
      // Mock generation result
      setTimetableData(prev => ({
        ...prev,
        lastGenerated: new Date().toISOString()
      }));
      
      setIsGenerating(false);
    }, 3000);
  };

  const handleCellUpdate = (day, timeSlot, newData) => {
    setTimetableData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [timeSlot]: newData
        }
      }
    }));
  };

  const handleCellClick = (day, timeSlot, cellData) => {
    console.log('Cell clicked:', { day, timeSlot, cellData });
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSubjectSelect = (subjectIds) => {
    setSelectedSubjects(subjectIds);
  };

  const panels = [
    { id: 'constraints', label: 'Constraints', icon: 'Settings' },
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader 
        userRole={currentUser.role}
        userName={currentUser.name}
        notifications={notifications}
      />
      
      <NavigationSidebar 
        userRole={currentUser.role}
        currentPath="/timetable-management"
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`transition-layout ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} pt-16`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <BreadcrumbContext items={breadcrumbItems} userRole={currentUser.role} />
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-foreground">Timetable Management</h1>
                <StatusIndicator 
                  connectionStatus="online"
                  syncStatus="synced"
                  lastSyncTime={new Date(Date.now() - 300000)}
                  systemHealth="healthy"
                />
              </div>
              <p className="text-muted-foreground mt-1">
                AI-powered scheduling for {currentUser.department} Department
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Download">
                Export All
              </Button>
              <Button variant="outline" iconName="Share">
                Share
              </Button>
              <Button variant="default" iconName="Save">
                Save Changes
              </Button>
            </div>
          </div>

          {/* View Switcher */}
          <div className="mb-6">
            <ViewSwitcher 
              currentView={currentView}
              onViewChange={setCurrentView}
              viewCounts={viewCounts}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Left Sidebar - Controls */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {/* Panel Switcher */}
              <div className="bg-card border border-border rounded-lg p-1">
                <div className="flex space-x-1">
                  {panels.map((panel) => (
                    <button
                      key={panel.id}
                      onClick={() => setActivePanel(panel.id)}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth flex-1 justify-center
                        ${activePanel === panel.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={panel.icon} size={14} />
                      <span className="hidden sm:inline">{panel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Content */}
              {activePanel === 'constraints' && (
                <ConstraintPanel
                  constraints={constraints}
                  onConstraintsChange={setConstraints}
                  onGenerateTimetable={handleGenerateTimetable}
                  isGenerating={isGenerating}
                />
              )}

              {activePanel === 'subjects' && (
                <SubjectPool
                  subjects={subjects}
                  onSubjectSelect={handleSubjectSelect}
                />
              )}

              {activePanel === 'analytics' && (
                <AnalyticsPanel
                  timetableData={timetableData}
                  viewMode={currentView}
                />
              )}
            </div>

            {/* Main Timetable Grid */}
            <div className="col-span-12 lg:col-span-9">
              <TimetableGrid
                timetableData={timetableData}
                viewMode={currentView}
                onCellUpdate={handleCellUpdate}
                onCellClick={handleCellClick}
                draggedItem={draggedItem}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                conflicts={conflicts}
              />
            </div>
          </div>

          {/* Generation Status */}
          {isGenerating && (
            <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg shadow-floating p-4 z-1200">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                <div>
                  <p className="font-medium text-foreground">Generating Timetable</p>
                  <p className="text-sm text-muted-foreground">AI is optimizing your schedule...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TimetableManagement;