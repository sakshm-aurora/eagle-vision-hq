import React, { useState } from 'react';
import { X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'alert',
    title: 'Batch B-2024-001 overdue',
    message: 'Quality inspection pending for 2 hours',
    timestamp: '5 min ago',
    read: false,
    severity: 'high'
  },
  {
    id: '2', 
    type: 'info',
    title: 'Inventory low stock alert',
    message: 'Cotton fabric below reorder threshold',
    timestamp: '15 min ago',
    read: false,
    severity: 'medium'
  },
  {
    id: '3',
    type: 'success',
    title: 'Batch B-2024-000 completed',
    message: 'Successfully dispatched 500 units',
    timestamp: '1 hour ago',
    read: true,
    severity: 'low'
  }
];

const getNotificationIcon = (type: string, severity: string) => {
  switch (type) {
    case 'alert':
      return severity === 'high' ? AlertTriangle : Info;
    case 'success':
      return CheckCircle;
    default:
      return Info;
  }
};

const getNotificationColor = (type: string, severity: string) => {
  switch (type) {
    case 'alert':
      return severity === 'high' ? 'text-destructive' : 'text-warning';
    case 'success':
      return 'text-success';
    default:
      return 'text-primary';
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  // Local state to manage filtering of notifications. Users can toggle between
  // showing all notifications, only unread notifications, or only critical
  // (high severity) alerts. This improves focus and reduces noise when
  // reviewing a large number of notifications.
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full bg-card border-l shadow-lg",
        "lg:relative lg:w-80 lg:shadow-none",
        "transform transition-transform duration-300 ease-in-out",
        "max-w-sm"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              <Badge variant="destructive" className="ml-1 text-xs">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4 space-y-2">
                {/* Filter controls */}
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === 'critical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('critical')}
                  >
                    Critical
                  </Button>
                </div>

                {mockNotifications
                  .filter((notification) => {
                    if (filter === 'unread') {
                      return !notification.read;
                    }
                    if (filter === 'critical') {
                      return notification.severity === 'high';
                    }
                    return true;
                  })
                  .map((notification) => {
                    const Icon = getNotificationIcon(notification.type, notification.severity);
                    const iconColor = getNotificationColor(notification.type, notification.severity);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-3 rounded-lg border transition-colors hover:bg-secondary',
                          !notification.read && 'bg-primary/5 border-primary/20'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', iconColor)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                              <div className="flex gap-1">
                                {!notification.read && (
                                  <Button variant="ghost" size="sm" className="text-xs h-6">
                                    Mark as read
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" className="text-xs h-6">
                                  Snooze
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs h-6">
                                  Assign
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2 p-4">
                {mockNotifications
                  .filter(n => n.type === 'alert')
                  .map((notification) => {
                    const Icon = getNotificationIcon(notification.type, notification.severity);
                    const iconColor = getNotificationColor(notification.type, notification.severity);

                    return (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg border bg-destructive/5 border-destructive/20"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", iconColor)} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No pending tasks</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};