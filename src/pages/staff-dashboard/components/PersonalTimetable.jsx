import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PersonalTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // week, month

  // Mock timetable data
  const timetableData = [
    {
      id: 1,
      subject: "Data Structures",
      code: "CS201",
      type: "Core",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      room: "Lab-A101",
      class: "CS-2A",
      color: "bg-blue-500"
    },
    {
      id: 2,
      subject: "Database Management",
      code: "CS301",
      type: "Core",
      day: "Monday",
      startTime: "11:00",
      endTime: "12:30",
      room: "Room-B205",
      class: "CS-3B",
      color: "bg-green-500"
    },
    {
      id: 3,
      subject: "Web Development",
      code: "CS401",
      type: "Elective",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:30",
      room: "Lab-C102",
      class: "CS-4A",
      color: "bg-purple-500"
    },
    {
      id: 4,
      subject: "Machine Learning",
      code: "CS501",
      type: "Elective",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:30",
      room: "Room-A301",
      class: "CS-5A",
      color: "bg-orange-500"
    },
    {
      id: 5,
      subject: "Software Engineering",
      code: "CS302",
      type: "Core",
      day: "Thursday",
      startTime: "09:30",
      endTime: "11:00",
      room: "Room-B103",
      class: "CS-3A",
      color: "bg-red-500"
    },
    {
      id: 6,
      subject: "Data Structures Lab",
      code: "CS201L",
      type: "Lab",
      day: "Friday",
      startTime: "13:00",
      endTime: "16:00",
      room: "Lab-A201",
      class: "CS-2A",
      color: "bg-indigo-500"
    }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 6; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const markUnavailable = (day, timeSlot) => {
    const slotKey = `${day}-${timeSlot}`;
    if (unavailableSlots.includes(slotKey)) {
      setUnavailableSlots(prev => prev.filter(slot => slot !== slotKey));
    } else {
      setUnavailableSlots(prev => [...prev, slotKey]);
    }
  };

  const getClassForTimeSlot = (day, timeSlot) => {
    const slotKey = `${day}-${timeSlot}`;
    const isUnavailable = unavailableSlots.includes(slotKey);
    
    const scheduledClass = timetableData.find(item => 
      item.day === day && 
      timeSlot >= item.startTime && 
      timeSlot < item.endTime
    );

    if (scheduledClass) {
      return `${scheduledClass.color} text-white cursor-pointer hover:opacity-80`;
    }
    
    if (isUnavailable) {
      return "bg-red-100 text-red-800 cursor-pointer hover:bg-red-200";
    }
    
    return "bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200";
  };

  const handleSlotClick = (day, timeSlot) => {
    const scheduledClass = timetableData.find(item => 
      item.day === day && 
      timeSlot >= item.startTime && 
      timeSlot < item.endTime
    );

    if (scheduledClass) {
      setSelectedSlot(scheduledClass);
    } else {
      markUnavailable(day, timeSlot);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">My Timetable</h2>
          <p className="text-sm text-muted-foreground">
            Week of {weekDates[0].toLocaleDateString()} - {weekDates[5].toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                viewMode === 'week' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-smooth ${
                viewMode === 'month' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Month
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-3 py-1 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-smooth"
            >
              Today
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="p-2 text-xs font-medium text-muted-foreground">Time</div>
            {weekDays.map((day, index) => (
              <div key={day} className="p-2 text-center">
                <div className="text-sm font-medium text-foreground">{day}</div>
                <div className="text-xs text-muted-foreground">
                  {weekDates[index]?.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="grid grid-cols-7 gap-1">
                <div className="p-2 text-xs text-muted-foreground font-medium">
                  {timeSlot}
                </div>
                {weekDays.map(day => {
                  const scheduledClass = timetableData.find(item => 
                    item.day === day && 
                    timeSlot >= item.startTime && 
                    timeSlot < item.endTime
                  );

                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className={`p-2 min-h-[40px] rounded-md transition-smooth ${getClassForTimeSlot(day, timeSlot)}`}
                      onClick={() => handleSlotClick(day, timeSlot)}
                    >
                      {scheduledClass && (
                        <div className="text-xs">
                          <div className="font-medium truncate">{scheduledClass.subject}</div>
                          <div className="opacity-90">{scheduledClass.room}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Core Subjects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Electives</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span className="text-xs text-muted-foreground">Labs</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-xs text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Class Details</h3>
              <button
                onClick={() => setSelectedSlot(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-foreground">Subject:</span>
                <p className="text-sm text-muted-foreground">{selectedSlot.subject} ({selectedSlot.code})</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Time:</span>
                <p className="text-sm text-muted-foreground">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Room:</span>
                <p className="text-sm text-muted-foreground">{selectedSlot.room}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Class:</span>
                <p className="text-sm text-muted-foreground">{selectedSlot.class}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Type:</span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedSlot.type === 'Core' ? 'bg-blue-100 text-blue-800' :
                  selectedSlot.type === 'Elective'? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedSlot.type}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => console.log('Request change for:', selectedSlot.id)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth text-sm font-medium"
              >
                Request Change
              </button>
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-smooth text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTimetable;