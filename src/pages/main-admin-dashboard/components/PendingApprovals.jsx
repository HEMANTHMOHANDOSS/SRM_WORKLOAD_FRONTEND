import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingApprovals = ({ approvals, onApprove, onReject, onViewDetails }) => {
  const getApprovalIcon = (type) => {
    const iconMap = {
      'staff-registration': 'UserPlus',
      'department-request': 'Building2',
      'timetable-change': 'Calendar',
      'system-access': 'Key'
    };
    return iconMap[type] || 'Clock';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-muted-foreground'
    };
    return colorMap[priority] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just submitted';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
            {approvals.length > 0 && (
              <span className="bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full font-medium">
                {approvals.length}
              </span>
            )}
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
            View All
          </button>
        </div>
      </div>

      <div className="p-4">
        {approvals.length > 0 ? (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Icon name={getApprovalIcon(approval.type)} size={20} className="text-warning" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {approval.title}
                        </h4>
                        <span className={`text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                          {approval.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {approval.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={12} />
                          <span>{approval.requester}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{formatTimeAgo(approval.timestamp)}</span>
                        </div>
                        {approval.department && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Building2" size={12} />
                            <span>{approval.department}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onViewDetails(approval.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    View Details
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="X"
                      iconPosition="left"
                      onClick={() => onReject(approval.id)}
                      className="text-error hover:text-error border-error/20 hover:border-error"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Check"
                      iconPosition="left"
                      onClick={() => onApprove(approval.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-success/50" />
            <h4 className="text-sm font-medium text-foreground mb-2">All caught up!</h4>
            <p className="text-xs text-muted-foreground">
              No pending approvals at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;