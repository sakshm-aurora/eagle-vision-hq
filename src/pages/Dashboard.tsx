import React from 'react';
import { KPICards } from '@/components/dashboard/KPICards';
import { GanttChart } from '@/components/dashboard/GanttChart';
import { BatchProgress } from '@/components/dashboard/BatchProgress';
import { AlertsWidget } from '@/components/dashboard/AlertsWidget';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your factory operations
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <GanttChart />
          <BatchProgress />
        </div>
        <div className="xl:col-span-1">
          <AlertsWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;