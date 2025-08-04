import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BatchProgressData {
  id: string;
  name: string;
  phases: {
    sourcing: number;
    stitching: number;
    qa: number;
    dispatch: number;
  };
  currentPhase: 'sourcing' | 'stitching' | 'qa' | 'dispatch';
}

const mockProgressData: BatchProgressData[] = [
  {
    id: 'B-2024-001',
    name: 'Cotton T-Shirts',
    phases: { sourcing: 100, stitching: 100, qa: 75, dispatch: 0 },
    currentPhase: 'qa',
  },
  {
    id: 'B-2024-002',
    name: 'Denim Jeans',
    phases: { sourcing: 100, stitching: 45, qa: 0, dispatch: 0 },
    currentPhase: 'stitching',
  },
  {
    id: 'B-2024-003',
    name: 'Winter Jackets',
    phases: { sourcing: 20, stitching: 0, qa: 0, dispatch: 0 },
    currentPhase: 'sourcing',
  },
  {
    id: 'B-2024-004',
    name: 'Summer Dresses',
    phases: { sourcing: 100, stitching: 100, qa: 100, dispatch: 95 },
    currentPhase: 'dispatch',
  },
];

const phaseConfig = [
  { key: 'sourcing', label: 'Sourcing', color: 'bg-batch-sourcing' },
  { key: 'stitching', label: 'Stitching', color: 'bg-batch-stitching' },
  { key: 'qa', label: 'QA', color: 'bg-batch-qa' },
  { key: 'dispatch', label: 'Dispatch', color: 'bg-batch-dispatch' },
];

export const BatchProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Progress Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockProgressData.map((batch) => {
            const overallProgress = Object.values(batch.phases).reduce((a, b) => a + b, 0) / 4;
            
            return (
              <div key={batch.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{batch.id}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {batch.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Math.round(overallProgress)}%
                    </span>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        batch.currentPhase === 'sourcing' && "bg-batch-sourcing text-white",
                        batch.currentPhase === 'stitching' && "bg-batch-stitching text-white",
                        batch.currentPhase === 'qa' && "bg-batch-qa text-white",
                        batch.currentPhase === 'dispatch' && "bg-batch-dispatch text-white"
                      )}
                    >
                      {batch.currentPhase.charAt(0).toUpperCase() + batch.currentPhase.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {phaseConfig.map((phase) => (
                    <div key={phase.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{phase.label}</span>
                        <span className="font-medium">
                          {batch.phases[phase.key as keyof typeof batch.phases]}%
                        </span>
                      </div>
                      <Progress 
                        value={batch.phases[phase.key as keyof typeof batch.phases]} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Overall progress bar */}
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  {phaseConfig.map((phase, index) => (
                    <div
                      key={phase.key}
                      className={cn(
                        "absolute top-0 h-full transition-all",
                        phase.color
                      )}
                      style={{
                        left: `${index * 25}%`,
                        width: `${batch.phases[phase.key as keyof typeof batch.phases] / 4}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};