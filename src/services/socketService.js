import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  setupEventListeners() {
    // Timetable updates
    this.socket.on('timetable_updated', (data) => {
      this.emit('timetable_updated', data);
    });

    // Form submissions
    this.socket.on('new_form_submission', (data) => {
      this.emit('new_form_submission', data);
    });

    // Staff approvals
    this.socket.on('approval_update', (data) => {
      this.emit('approval_update', data);
    });

    this.socket.on('staff_approval_processed', (data) => {
      this.emit('staff_approval_processed', data);
    });

    // Notifications
    this.socket.on('new_notification', (data) => {
      this.emit('new_notification', data);
    });

    // System announcements
    this.socket.on('system_announcement', (data) => {
      this.emit('system_announcement', data);
    });

    // Typing indicators
    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in socket event callback:', error);
        }
      });
    }
  }

  // Socket emission methods
  emitTimetableUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('timetable_update', data);
    }
  }

  emitFormSubmission(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('form_submission', data);
    }
  }

  emitStaffApproval(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('staff_approval', data);
    }
  }

  emitFormTyping(formId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('form_typing', { formId, isTyping });
    }
  }

  joinNotifications() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_notifications');
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SocketService();