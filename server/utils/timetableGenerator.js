const logger = require('./logger');

class TimetableGenerator {
  constructor() {
    this.timeSlots = [
      { start: '09:00', end: '09:50', duration: 50 },
      { start: '09:50', end: '10:40', duration: 50 },
      { start: '10:40', end: '11:30', duration: 50 },
      { start: '11:30', end: '11:45', duration: 15, isBreak: true, breakType: 'short_break' },
      { start: '11:45', end: '12:35', duration: 50 },
      { start: '12:35', end: '13:25', duration: 50 },
      { start: '13:25', end: '14:15', duration: 50 },
      { start: '14:15', end: '15:00', duration: 45, isBreak: true, breakType: 'lunch_break' },
      { start: '15:00', end: '15:50', duration: 50 },
      { start: '15:50', end: '16:40', duration: 50 },
      { start: '16:40', end: '17:30', duration: 50 }
    ];
    
    this.daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  }

  async generateTimetable(subjects, constraints, rooms, instructors) {
    try {
      logger.info('Starting timetable generation', { 
        subjectCount: subjects.length, 
        constraints 
      });

      const workingDays = this.daysOfWeek.slice(0, constraints.workingDays || 5);
      const availableSlots = this.getAvailableTimeSlots(constraints);
      
      // Initialize timetable structure
      const timetable = this.initializeTimetable(workingDays, availableSlots);
      
      // Sort subjects by priority (core subjects first, then by hours)
      const sortedSubjects = this.prioritizeSubjects(subjects);
      
      // Generate schedule
      const schedule = await this.scheduleSubjects(
        sortedSubjects, 
        timetable, 
        constraints, 
        rooms, 
        instructors
      );

      // Detect conflicts
      const conflicts = this.detectConflicts(schedule);
      
      // Attempt to resolve conflicts if auto-resolve is enabled
      if (constraints.autoResolveConflicts && conflicts.length > 0) {
        await this.resolveConflicts(schedule, conflicts, constraints);
      }

      logger.info('Timetable generation completed', { 
        scheduledSlots: schedule.length,
        conflicts: conflicts.length 
      });

      return {
        schedule,
        conflicts,
        statistics: this.generateStatistics(schedule, subjects, instructors)
      };
    } catch (error) {
      logger.error('Timetable generation failed', { error: error.message });
      throw error;
    }
  }

  initializeTimetable(workingDays, timeSlots) {
    const timetable = {};
    workingDays.forEach(day => {
      timetable[day] = {};
      timeSlots.forEach(slot => {
        if (!slot.isBreak) {
          timetable[day][`${slot.start}-${slot.end}`] = null;
        }
      });
    });
    return timetable;
  }

  getAvailableTimeSlots(constraints) {
    return this.timeSlots.filter(slot => {
      if (slot.isBreak) return false;
      
      const startTime = this.timeToMinutes(slot.start);
      const constraintStart = this.timeToMinutes(constraints.startTime || '09:00');
      const constraintEnd = this.timeToMinutes(constraints.endTime || '17:00');
      
      return startTime >= constraintStart && startTime < constraintEnd;
    });
  }

  prioritizeSubjects(subjects) {
    return subjects.sort((a, b) => {
      // Core subjects first
      if (a.type === 'core' && b.type !== 'core') return -1;
      if (b.type === 'core' && a.type !== 'core') return 1;
      
      // Labs second
      if (a.type === 'lab' && b.type !== 'lab') return -1;
      if (b.type === 'lab' && a.type !== 'lab') return 1;
      
      // Then by hours per week (descending)
      return b.hours_per_week - a.hours_per_week;
    });
  }

  async scheduleSubjects(subjects, timetable, constraints, rooms, instructors) {
    const schedule = [];
    const workingDays = Object.keys(timetable);
    
    for (const subject of subjects) {
      const slotsNeeded = subject.hours_per_week;
      let slotsScheduled = 0;
      
      // Try to schedule all required slots for this subject
      for (let attempt = 0; attempt < 10 && slotsScheduled < slotsNeeded; attempt++) {
        const slot = this.findBestSlot(
          subject, 
          timetable, 
          constraints, 
          workingDays, 
          rooms, 
          instructors
        );
        
        if (slot) {
          // Find appropriate room
          const room = this.findAvailableRoom(slot, subject, rooms, schedule);
          
          if (room) {
            const scheduleEntry = {
              subject_id: subject.id,
              instructor_id: subject.instructor_id,
              room_id: room.id,
              day_of_week: slot.day,
              start_time: slot.startTime,
              end_time: slot.endTime,
              duration_minutes: slot.duration,
              slot_type: subject.type === 'lab' ? 'lab' : 'lecture',
              color: this.getSubjectColor(subject.type)
            };
            
            schedule.push(scheduleEntry);
            timetable[slot.day][slot.timeSlot] = scheduleEntry;
            slotsScheduled++;
          }
        }
      }
      
      if (slotsScheduled < slotsNeeded) {
        logger.warn(`Could not schedule all slots for subject ${subject.name}`, {
          required: slotsNeeded,
          scheduled: slotsScheduled
        });
      }
    }
    
    return schedule;
  }

  findBestSlot(subject, timetable, constraints, workingDays, rooms, instructors) {
    const availableSlots = [];
    
    workingDays.forEach(day => {
      Object.keys(timetable[day]).forEach(timeSlot => {
        if (timetable[day][timeSlot] === null) {
          const [startTime, endTime] = timeSlot.split('-');
          
          // Check constraints
          if (this.checkSlotConstraints(subject, day, startTime, constraints)) {
            availableSlots.push({
              day,
              timeSlot,
              startTime,
              endTime,
              duration: this.calculateDuration(startTime, endTime),
              score: this.calculateSlotScore(subject, day, startTime, constraints)
            });
          }
        }
      });
    });
    
    // Sort by score (higher is better)
    availableSlots.sort((a, b) => b.score - a.score);
    
    return availableSlots[0] || null;
  }

  checkSlotConstraints(subject, day, startTime, constraints) {
    const timeMinutes = this.timeToMinutes(startTime);
    
    // Check if it's too early for labs
    if (subject.type === 'lab' && constraints.avoidEarlyLabs) {
      if (timeMinutes < this.timeToMinutes('10:00')) {
        return false;
      }
    }
    
    // Add more constraint checks here
    return true;
  }

  calculateSlotScore(subject, day, startTime, constraints) {
    let score = 100;
    const timeMinutes = this.timeToMinutes(startTime);
    
    // Prefer morning slots for core subjects
    if (subject.type === 'core' && timeMinutes < this.timeToMinutes('12:00')) {
      score += 20;
    }
    
    // Prefer afternoon slots for electives
    if (subject.type === 'elective' && timeMinutes >= this.timeToMinutes('14:00')) {
      score += 15;
    }
    
    // Prefer mid-morning for labs
    if (subject.type === 'lab' && timeMinutes >= this.timeToMinutes('10:00') && timeMinutes < this.timeToMinutes('12:00')) {
      score += 25;
    }
    
    return score;
  }

  findAvailableRoom(slot, subject, rooms, schedule) {
    const requiredType = subject.type === 'lab' ? 'laboratory' : 'classroom';
    
    const availableRooms = rooms.filter(room => {
      // Check room type
      if (subject.type === 'lab' && !room.is_lab) return false;
      if (subject.type !== 'lab' && room.is_lab) return false;
      
      // Check if room is available at this time
      const isOccupied = schedule.some(entry => 
        entry.room_id === room.id &&
        entry.day_of_week === slot.day &&
        this.timesOverlap(entry.start_time, entry.end_time, slot.startTime, slot.endTime)
      );
      
      return !isOccupied;
    });
    
    // Return the first available room (could be improved with scoring)
    return availableRooms[0] || null;
  }

  detectConflicts(schedule) {
    const conflicts = [];
    
    // Check for instructor conflicts
    const instructorSlots = {};
    schedule.forEach(slot => {
      const key = `${slot.instructor_id}-${slot.day_of_week}-${slot.start_time}`;
      if (instructorSlots[key]) {
        conflicts.push({
          type: 'instructor_conflict',
          message: 'Instructor double-booked',
          slots: [instructorSlots[key], slot]
        });
      } else {
        instructorSlots[key] = slot;
      }
    });
    
    // Check for room conflicts
    const roomSlots = {};
    schedule.forEach(slot => {
      const key = `${slot.room_id}-${slot.day_of_week}-${slot.start_time}`;
      if (roomSlots[key]) {
        conflicts.push({
          type: 'room_conflict',
          message: 'Room double-booked',
          slots: [roomSlots[key], slot]
        });
      } else {
        roomSlots[key] = slot;
      }
    });
    
    return conflicts;
  }

  async resolveConflicts(schedule, conflicts, constraints) {
    // Simple conflict resolution - try to reschedule conflicting slots
    for (const conflict of conflicts) {
      if (conflict.slots && conflict.slots.length > 1) {
        // Try to reschedule the second slot
        const slotToReschedule = conflict.slots[1];
        // Implementation would involve finding alternative slots
        logger.info('Attempting to resolve conflict', { conflict: conflict.type });
      }
    }
  }

  generateStatistics(schedule, subjects, instructors) {
    const stats = {
      totalSlots: schedule.length,
      subjectDistribution: {},
      instructorWorkload: {},
      roomUtilization: {},
      dailyDistribution: {}
    };
    
    // Calculate subject type distribution
    schedule.forEach(slot => {
      const subject = subjects.find(s => s.id === slot.subject_id);
      if (subject) {
        stats.subjectDistribution[subject.type] = (stats.subjectDistribution[subject.type] || 0) + 1;
      }
      
      // Calculate instructor workload
      stats.instructorWorkload[slot.instructor_id] = (stats.instructorWorkload[slot.instructor_id] || 0) + 1;
      
      // Calculate daily distribution
      stats.dailyDistribution[slot.day_of_week] = (stats.dailyDistribution[slot.day_of_week] || 0) + 1;
    });
    
    return stats;
  }

  getSubjectColor(type) {
    const colors = {
      'core': '#3B82F6',
      'elective': '#10B981',
      'lab': '#8B5CF6',
      'tutorial': '#F59E0B'
    };
    return colors[type] || '#6B7280';
  }

  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  calculateDuration(startTime, endTime) {
    return this.timeToMinutes(endTime) - this.timeToMinutes(startTime);
  }

  timesOverlap(start1, end1, start2, end2) {
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);
    
    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  }
}

module.exports = new TimetableGenerator();