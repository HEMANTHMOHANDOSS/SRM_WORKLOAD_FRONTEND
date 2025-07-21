import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const quickActions = [
    {
      id: 'register-department',
      title: 'Register Department',
      description: 'Add a new department to the system',
      icon: 'Building2',
      color: 'bg-primary/10 text-primary',
      action: () => onAction('register-department')
    },
    {
      id: 'bulk-export',
      title: 'Bulk Export',
      description: 'Export credentials and reports',
      icon: 'Download',
      color: 'bg-success/10 text-success',
      action: () => onAction('bulk-export')
    },
    {
      id: 'system-announcement',
      title: 'System Announcement',
      description: 'Create system-wide notification',
      icon: 'Megaphone',
      color: 'bg-warning/10 text-warning',
      action: () => onAction('system-announcement')
    },
    {
      id: 'backup-system',
      title: 'Backup System',
      description: 'Create system backup',
      icon: 'Database',
      color: 'bg-secondary/10 text-secondary',
      action: () => onAction('backup-system')
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'View system audit trail',
      icon: 'FileText',
      color: 'bg-accent/10 text-accent',
      action: () => onAction('audit-logs')
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure global settings',
      icon: 'Settings',
      color: 'bg-muted text-muted-foreground',
      action: () => onAction('system-settings')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Frequently used administrative tasks</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth text-left w-full"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <Icon name={action.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
              </div>
              
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Emergency Actions */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Emergency Actions</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
              onClick={() => onAction('system-maintenance')}
              className="w-full justify-start text-warning border-warning/20 hover:border-warning"
            >
              System Maintenance Mode
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Shield"
              iconPosition="left"
              onClick={() => onAction('security-lockdown')}
              className="w-full justify-start text-error border-error/20 hover:border-error"
            >
              Security Lockdown
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;