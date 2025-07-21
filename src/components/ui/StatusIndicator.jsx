import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ 
  connectionStatus = 'online', 
  syncStatus = 'synced', 
  lastSyncTime = null,
  pendingOperations = 0,
  systemHealth = 'healthy'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return { icon: 'Wifi', color: 'text-success', bgColor: 'bg-success/10' };
      case 'offline':
        return { icon: 'WifiOff', color: 'text-error', bgColor: 'bg-error/10' };
      case 'connecting':
        return { icon: 'Loader2', color: 'text-warning', bgColor: 'bg-warning/10' };
      default:
        return { icon: 'Wifi', color: 'text-muted-foreground', bgColor: 'bg-muted' };
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return { icon: 'Check', color: 'text-success' };
      case 'syncing':
        return { icon: 'RotateCw', color: 'text-warning animate-spin' };
      case 'error':
        return { icon: 'AlertCircle', color: 'text-error' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      default:
        return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const getSystemHealthIcon = () => {
    switch (systemHealth) {
      case 'healthy':
        return { icon: 'Heart', color: 'text-success' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'critical':
        return { icon: 'AlertOctagon', color: 'text-error' };
      default:
        return { icon: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    
    const now = currentTime;
    const sync = new Date(lastSyncTime);
    const diffMs = now - sync;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const connectionInfo = getConnectionIcon();
  const syncInfo = getSyncIcon();
  const healthInfo = getSystemHealthIcon();

  return (
    <div className="relative">
      {/* Compact Status Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-smooth"
        title="System Status"
      >
        {/* Connection Status */}
        <div className={`p-1 rounded-full ${connectionInfo.bgColor}`}>
          <Icon 
            name={connectionInfo.icon} 
            size={12} 
            className={`${connectionInfo.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} 
          />
        </div>

        {/* Sync Status */}
        <Icon 
          name={syncInfo.icon} 
          size={14} 
          className={syncInfo.color} 
        />

        {/* Pending Operations Badge */}
        {pendingOperations > 0 && (
          <span className="bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
            {pendingOperations > 99 ? '99+' : pendingOperations}
          </span>
        )}

        {/* Expand/Collapse Icon */}
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-muted-foreground" 
        />
      </button>

      {/* Expanded Status Panel */}
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-floating z-1200">
          <div className="p-4">
            <h3 className="font-medium text-popover-foreground mb-3 flex items-center">
              <Icon name="Activity" size={16} className="mr-2" />
              System Status
            </h3>

            {/* Connection Status */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name={connectionInfo.icon} size={16} className={connectionInfo.color} />
                <span className="text-sm text-popover-foreground">Connection</span>
              </div>
              <span className={`text-sm font-medium capitalize ${connectionInfo.color}`}>
                {connectionStatus}
              </span>
            </div>

            {/* Sync Status */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name={syncInfo.icon} size={16} className={syncInfo.color} />
                <span className="text-sm text-popover-foreground">Data Sync</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium capitalize ${syncInfo.color}`}>
                  {syncStatus}
                </span>
                <p className="text-xs text-muted-foreground">
                  {formatLastSync()}
                </p>
              </div>
            </div>

            {/* System Health */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name={healthInfo.icon} size={16} className={healthInfo.color} />
                <span className="text-sm text-popover-foreground">System Health</span>
              </div>
              <span className={`text-sm font-medium capitalize ${healthInfo.color}`}>
                {systemHealth}
              </span>
            </div>

            {/* Pending Operations */}
            {pendingOperations > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-sm text-popover-foreground">Pending Operations</span>
                </div>
                <span className="text-sm font-medium text-warning">
                  {pendingOperations}
                </span>
              </div>
            )}

            {/* Current Time */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-popover-foreground">Current Time</span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-smooth"
              >
                <Icon name="RotateCcw" size={12} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => console.log('Force sync triggered')}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-smooth"
                disabled={syncStatus === 'syncing'}
              >
                <Icon name="RefreshCw" size={12} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;