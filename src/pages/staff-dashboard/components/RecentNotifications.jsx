import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "schedule_change",
      title: "Schedule Change Alert",
      message: "Your Machine Learning class on Thursday has been moved from 2:00 PM to 3:30 PM in Room A-301.",
      timestamp: "2025-01-21T10:30:00",
      read: false,
      priority: "high",
      sender: "Department Admin",
      actionRequired: true
    },
    {
      id: 2,
      type: "form_deadline",
      title: "Choice Form Deadline Reminder",
      message: "Subject Preferences form deadline is approaching. Please submit by January 30, 2025.",
      timestamp: "2025-01-21T09:15:00",
      read: false,
      priority: "medium",
      sender: "System",
      actionRequired: true
    },
    {
      id: 3,
      type: "message",
      title: "Message from Dr. Smith",
      message: "Please review the updated syllabus for Data Structures course and provide your feedback.",
      timestamp: "2025-01-20T16:45:00",
      read: true,
      priority: "low",
      sender: "Dr. Smith",
      actionRequired: false
    },
    {
      id: 4,
      type: "system",
      title: "System Maintenance Notice",
      message: "Scheduled maintenance on January 25, 2025 from 2:00 AM to 4:00 AM. System will be unavailable.",
      timestamp: "2025-01-20T14:20:00",
      read: true,
      priority: "medium",
      sender: "IT Department",
      actionRequired: false
    },
    {
      id: 5,
      type: "collaboration",
      title: "Collaboration Request",
      message: "Prof. Johnson has requested collaboration for the Web Development project. Please respond.",
      timestamp: "2025-01-20T11:30:00",
      read: false,
      priority: "medium",
      sender: "Prof. Johnson",
      actionRequired: true
    },
    {
      id: 6,
      type: "document",
      title: "New Document Uploaded",
      message: "Lab Manual for Database Systems has been uploaded to the department files.",
      timestamp: "2025-01-19T15:10:00",
      read: true,
      priority: "low",
      sender: "Lab Coordinator",
      actionRequired: false
    },
    {
      id: 7,
      type: "feedback",
      title: "Student Feedback Available",
      message: "Student feedback for your Fall 2024 courses is now available for review.",
      timestamp: "2025-01-19T13:25:00",
      read: false,
      priority: "low",
      sender: "Academic Office",
      actionRequired: false
    },
    {
      id: 8,
      type: "workload",
      title: "Workload Alert",
      message: "You are approaching your maximum teaching hours limit. Current: 18/20 hours.",
      timestamp: "2025-01-18T10:00:00",
      read: true,
      priority: "high",
      sender: "System",
      actionRequired: false
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, high_priority, action_required

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule_change':
        return 'Calendar';
      case 'form_deadline':
        return 'Clock';
      case 'message':
        return 'MessageSquare';
      case 'system':
        return 'Settings';
      case 'collaboration':
        return 'Users';
      case 'document':
        return 'FileText';
      case 'feedback':
        return 'Star';
      case 'workload':
        return 'BarChart3';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50';
    
    switch (type) {
      case 'schedule_change':
        return 'text-blue-600 bg-blue-50';
      case 'form_deadline':
        return 'text-orange-600 bg-orange-50';
      case 'message':
        return 'text-green-600 bg-green-50';
      case 'system':
        return 'text-purple-600 bg-purple-50';
      case 'collaboration':
        return 'text-indigo-600 bg-indigo-50';
      case 'document':
        return 'text-gray-600 bg-gray-50';
      case 'feedback':
        return 'text-yellow-600 bg-yellow-50';
      case 'workload':
        return 'text-pink-600 bg-pink-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high_priority':
        return notification.priority === 'high';
      case 'action_required':
        return notification.actionRequired;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recent Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Stay updated with important announcements and alerts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            iconName="CheckCheck"
            iconPosition="left"
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'high_priority', label: 'High Priority', count: highPriorityCount },
            { key: 'action_required', label: 'Action Required', count: actionRequiredCount }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                filter === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === tab.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-card rounded-lg border transition-smooth hover:shadow-elevated ${
              !notification.read ? 'border-primary/50 bg-primary/5' : 'border-border'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-4">
                {/* Notification Icon */}
                <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                  <Icon name={getNotificationIcon(notification.type)} size={18} />
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-muted-foreground hover:text-error hover:bg-error/10 rounded-md transition-smooth"
                        title="Delete notification"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="User" size={12} />
                        <span>{notification.sender}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </span>
                      {notification.actionRequired && (
                        <span className="flex items-center space-x-1 text-warning">
                          <Icon name="AlertCircle" size={12} />
                          <span>Action Required</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      {notification.actionRequired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Take action for:', notification.id)}
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {filter === 'all' ? "You're all caught up! No notifications to display."
              : `No ${filter.replace('_', ' ')} notifications found.`
            }
          </p>
          {filter !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('all')}
              className="mt-4"
            >
              View All Notifications
            </Button>
          )}
        </div>
      )}

      {/* Notification Summary */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Notification Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{notifications.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">{unreadCount}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-error">{highPriorityCount}</div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{actionRequiredCount}</div>
            <div className="text-xs text-muted-foreground">Action Required</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentNotifications;