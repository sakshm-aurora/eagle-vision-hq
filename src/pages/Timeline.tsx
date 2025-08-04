import React from 'react';
import { GanttChart } from '@/components/dashboard/GanttChart';
import { BatchProgress } from '@/components/dashboard/BatchProgress';

/**
 * Timeline page provides a consolidated view of all active batches across
 * the manufacturing pipeline. It leverages the existing GanttChart and
 * BatchProgress components from the dashboard but surfaces them on a
 * dedicated route. This allows supervisors to drill down into scheduling
 * without the distraction of other dashboard widgets.
 */
const Timeline: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground">
            Visualize production schedules and identify overlaps or delays
          </p>
        </div>
      </div>
      <GanttChart />
      <BatchProgress />
    </div>
  );
};

export default Timeline;