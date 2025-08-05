import React from 'react';
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  type: 'overdue' | 'shortage' | 'completed' | 'approval';
  batchId?: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'QA Inspection Overdue',
    description: 'Batch B-2024-001 quality check pending for 2 hours',
    severity: 'high',
    timestamp: '5 min ago',
    type: 'overdue',
    batchId: 'B-2024-001',
  },
  {
    id: '2',
    title: 'Low Stock Alert',
    description: 'Cotton fabric inventory below reorder threshold (15 units remaining)',
    severity: 'medium',
    timestamp: '15 min ago',
    type: 'shortage',
  },
  {
    id: '3',
    title: 'Batch Completed',
    description: 'B-2024-004 successfully completed and ready for dispatch',
    severity: 'low',
    timestamp: '1 hour ago',
    type: 'completed',
    batchId: 'B-2024-004',
  },
  {
    id: '4',
    title: 'Approval Required',
    description: 'Manager approval needed for material substitution in B-2024-002',
    severity: 'medium',
    timestamp: '2 hours ago',
    type: 'approval',
    batchId: 'B-2024-002',
  },
  {
    id: '5',
    title: 'Equipment Maintenance',
    description: 'Stitching machine #3 scheduled for maintenance in 1 hour',
    severity: 'low',
    timestamp: '3 hours ago',
    type: 'overdue',
  },
];

const getAlertIcon = (type: string, severity: string) => {
  switch (type) {
    case 'overdue':
    case 'shortage':
      return AlertTriangle;
    case 'approval':
      return Clock;
    case 'completed':
      return CheckCircle;
    default:
      return AlertTriangle;
  }
};

const getAlertColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-destructive border-destructive/20 bg-destructive/5';
    case 'medium':
      return 'text-warning border-warning/20 bg-warning/5';
    case 'low':
      return 'text-success border-success/20 bg-success/5';
    default:
      return 'text-muted-foreground border-border bg-muted/5';
  }
};

const getSeverityBadgeVariant = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const AlertsWidget = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Alerts</span>
          {/* Link to the full alerts page. Removing the Alerts entry from the
              sidebar makes this button the primary way to view all alerts. */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => {
              window.location.href = '/alerts';
            }}
          >
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-6 pb-6 space-y-3">
            {mockAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type, alert.severity);
              const alertColor = getAlertColor(alert.severity);
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all",
                    alertColor
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {alert.title}
                        </h4>
                        <Badge 
                          variant={getSeverityBadgeVariant(alert.severity)}
                          className="text-xs ml-2 shrink-0"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                        {alert.batchId && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-6 p-1"
                          >
                            View {alert.batchId}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};