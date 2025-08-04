import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BatchData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  currentPhase: 'sourcing' | 'stitching' | 'qa' | 'dispatch';
  progress: number;
  manager: string;
}

const mockBatches: BatchData[] = [
  {
    id: 'B-2024-001',
    name: 'Cotton T-Shirts (500 units)',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-22'),
    currentPhase: 'qa',
    progress: 75,
    manager: 'Sarah Chen',
  },
  {
    id: 'B-2024-002',
    name: 'Denim Jeans (300 units)',
    startDate: new Date('2024-01-16'),
    endDate: new Date('2024-01-25'),
    currentPhase: 'stitching',
    progress: 45,
    manager: 'Mike Rodriguez',
  },
  {
    id: 'B-2024-003',
    name: 'Winter Jackets (200 units)',
    startDate: new Date('2024-01-18'),
    endDate: new Date('2024-01-28'),
    currentPhase: 'sourcing',
    progress: 20,
    manager: 'Emma Watson',
  },
  {
    id: 'B-2024-004',
    name: 'Summer Dresses (400 units)',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-30'),
    currentPhase: 'dispatch',
    progress: 95,
    manager: 'James Liu',
  },
];

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'sourcing': return 'bg-batch-sourcing';
    case 'stitching': return 'bg-batch-stitching';
    case 'qa': return 'bg-batch-qa';
    case 'dispatch': return 'bg-batch-dispatch';
    default: return 'bg-muted';
  }
};

const getPhaseLabel = (phase: string) => {
  switch (phase) {
    case 'sourcing': return 'Sourcing';
    case 'stitching': return 'Stitching';
    case 'qa': return 'Quality Check';
    case 'dispatch': return 'Dispatch';
    default: return phase;
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const GanttChart = () => {
  const today = new Date();
  const chartStart = new Date('2024-01-15');
  const chartEnd = new Date('2024-01-31');
  const totalDays = Math.ceil((chartEnd.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));

  const getTodayPosition = () => {
    const daysFromStart = Math.ceil((today.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));
    return (daysFromStart / totalDays) * 100;
  };

  const getBarPosition = (startDate: Date, endDate: Date) => {
    const startDays = Math.ceil((startDate.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startDays / totalDays) * 100;
    const width = (durationDays / totalDays) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Batches Timeline</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatDate(chartStart)} - {formatDate(chartEnd)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline header */}
          <div className="relative">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Jan 15</span>
              <span>Jan 23</span>
              <span>Jan 31</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full">
              {/* Today marker */}
              <div 
                className="absolute top-0 w-0.5 h-6 bg-destructive -mt-2"
                style={{ left: `${getTodayPosition()}%` }}
              >
                <div className="absolute -top-6 -left-6 text-xs text-destructive font-medium">
                  Today
                </div>
              </div>
            </div>
          </div>

          {/* Gantt bars */}
          <div className="space-y-3">
            {mockBatches.map((batch) => {
              const barStyle = getBarPosition(batch.startDate, batch.endDate);
              
              return (
                <div key={batch.id} className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium w-24 shrink-0">
                      {batch.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-muted-foreground truncate">
                        {batch.name}
                      </span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getPhaseColor(batch.currentPhase))}
                    >
                      {getPhaseLabel(batch.currentPhase)}
                    </Badge>
                  </div>
                  
                  <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute top-0 h-full rounded-full transition-all group-hover:shadow-md",
                        getPhaseColor(batch.currentPhase)
                      )}
                      style={barStyle}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 rounded-full" />
                    </div>
                    
                    {/* Progress indicator */}
                    <div
                      className="absolute top-1 left-1 h-4 bg-white/30 rounded-full"
                      style={{ 
                        left: barStyle.left,
                        width: `${(parseFloat(barStyle.width.replace('%', '')) * batch.progress / 100)}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{batch.manager}</span>
                    <span>{batch.progress}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};