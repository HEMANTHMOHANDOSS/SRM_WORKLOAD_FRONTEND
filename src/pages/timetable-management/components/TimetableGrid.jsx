import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimetableGrid = ({ 
  timetableData, 
  viewMode, 
  onCellUpdate, 
  onCellClick, 
  draggedItem, 
  onDragStart, 
  onDragEnd,
  conflicts = []
}) => {
  const [dragOverCell, setDragOverCell] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const gridRef = useRef(null);

  const timeSlots = [
    '09:00 - 09:50',
    '09:50 - 10:40',
    '10:40 - 11:30',
    '11:30 - 11:45', // Break
    '11:45 - 12:35',
    '12:35 - 13:25',
    '13:25 - 14:15',
    '14:15 - 15:00', // Lunch
    '15:00 - 15:50',
    '15:50 - 16:40',
    '16:40 - 17:30'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const workingDays = days.slice(0, timetableData.workingDays || 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const handleCellRightClick = (e, day, timeSlot, cellData) => {
    e.preventDefault();
    const rect = gridRef.current.getBoundingClientRect();
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      day,
      timeSlot,
      cellData
    });
  };

  const handleCellLeftClick = (day, timeSlot, cellData) => {
    setSelectedCell({ day, timeSlot });
    setContextMenu(null);
    onCellClick && onCellClick(day, timeSlot, cellData);
  };

  const handleDragOver = (e, day, timeSlot) => {
    e.preventDefault();
    setDragOverCell({ day, timeSlot });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    setDragOverCell(null);
    
    if (draggedItem) {
      onCellUpdate && onCellUpdate(day, timeSlot, draggedItem);
      onDragEnd && onDragEnd();
    }
  };

  const getCellData = (day, timeSlot) => {
    return timetableData.schedule?.[day]?.[timeSlot] || null;
  };

  const isBreakTime = (timeSlot) => {
    return timeSlot.includes('11:30 - 11:45') || timeSlot.includes('14:15 - 15:00');
  };

  const isConflict = (day, timeSlot) => {
    return conflicts.some(conflict => 
      conflict.day === day && conflict.timeSlot === timeSlot
    );
  };

  const isDragTarget = (day, timeSlot) => {
    return dragOverCell?.day === day && dragOverCell?.timeSlot === timeSlot;
  };

  const isSelected = (day, timeSlot) => {
    return selectedCell?.day === day && selectedCell?.timeSlot === timeSlot;
  };

  const getSubjectColor = (subjectType) => {
    const colors = {
      'core': 'bg-blue-100 border-blue-300 text-blue-800',
      'elective': 'bg-green-100 border-green-300 text-green-800',
      'lab': 'bg-purple-100 border-purple-300 text-purple-800',
      'tutorial': 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return colors[subjectType] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const renderCell = (day, timeSlot) => {
    const cellData = getCellData(day, timeSlot);
    const isBreak = isBreakTime(timeSlot);
    const hasConflict = isConflict(day, timeSlot);
    const isDragOver = isDragTarget(day, timeSlot);
    const isSelectedCell = isSelected(day, timeSlot);

    let cellClasses = `
      relative border border-border h-16 transition-all duration-200
      ${isBreak ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'}
      ${hasConflict ? 'bg-error/10 border-error' : ''}
      ${isDragOver ? 'bg-primary/10 border-primary border-2' : ''}
      ${isSelectedCell ? 'ring-2 ring-primary ring-offset-1' : ''}
      ${cellData && !isBreak ? 'cursor-pointer' : ''}
    `;

    if (isBreak) {
      return (
        <div className={cellClasses}>
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground font-medium">
              {timeSlot.includes('11:30') ? 'Break' : 'Lunch'}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={cellClasses}
        onClick={() => handleCellLeftClick(day, timeSlot, cellData)}
        onContextMenu={(e) => handleCellRightClick(e, day, timeSlot, cellData)}
        onDragOver={(e) => handleDragOver(e, day, timeSlot)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, day, timeSlot)}
      >
        {cellData ? (
          <div
            className={`h-full p-2 rounded border-l-4 ${getSubjectColor(cellData.type)}`}
            draggable
            onDragStart={() => onDragStart && onDragStart(cellData)}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="font-medium text-xs truncate">{cellData.subject}</p>
                <p className="text-xs opacity-75 truncate">{cellData.instructor}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75">{cellData.room}</span>
                {cellData.type === 'lab' && cellData.dualStaff && (
                  <Icon name="Users" size={10} className="opacity-75" />
                )}
              </div>
            </div>
            {hasConflict && (
              <div className="absolute top-1 right-1">
                <Icon name="AlertTriangle" size={12} className="text-error" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <Icon name="Plus" size={16} className="text-muted-foreground/30" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col" ref={gridRef}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Timetable
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="Printer">
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-0 border-b border-border bg-muted/30">
            <div className="p-3 font-medium text-sm text-foreground border-r border-border">
              Time Slot
            </div>
            {workingDays.map(day => (
              <div key={day} className="p-3 font-medium text-sm text-foreground text-center border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 gap-0 border-b border-border last:border-b-0">
              <div className="p-3 text-xs font-medium text-muted-foreground border-r border-border bg-muted/20 flex items-center">
                {timeSlot}
              </div>
              {workingDays.map(day => (
                <div key={`${day}-${timeSlot}`} className="border-r border-border last:border-r-0">
                  {renderCell(day, timeSlot)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu absolute bg-popover border border-border rounded-lg shadow-floating z-1300 py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2">
            <Icon name="Edit" size={14} />
            <span>Edit Class</span>
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2">
            <Icon name="Copy" size={14} />
            <span>Duplicate</span>
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2">
            <Icon name="Move" size={14} />
            <span>Move to...</span>
          </button>
          <hr className="my-1 border-border" />
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-error flex items-center space-x-2">
            <Icon name="Trash2" size={14} />
            <span>Remove</span>
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-xs text-muted-foreground">Core</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-xs text-muted-foreground">Elective</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-xs text-muted-foreground">Lab</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span className="text-xs text-muted-foreground">Tutorial</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Info" size={12} />
            <span>Right-click for options • Drag to move classes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;