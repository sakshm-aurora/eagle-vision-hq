import React from 'react';
import { TrendingUp, TrendingDown, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KPICardData {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
  actionLabel?: string;
  actionHref?: string;
}

const kpiData: KPICardData[] = [
  {
    title: 'Active Batches',
    value: '12',
    subtitle: 'Currently in production',
    trend: 'up',
    trendValue: '+3 from yesterday',
    icon: Package,
  },
  {
    title: 'Average Cycle Time',
    value: '4.2 days',
    subtitle: 'Target: 3.5 days',
    trend: 'down',
    trendValue: '-0.3 days from last week',
    icon: Clock,
  },
  {
    title: 'Stock Shortages',
    value: '7',
    subtitle: 'Items below threshold',
    trend: 'up',
    trendValue: '+2 since morning',
    icon: AlertTriangle,
    actionLabel: 'View',
    actionHref: '/inventory',
  },
  {
    title: 'Overdue Approvals',
    value: '3',
    subtitle: 'Pending QA signoff',
    trend: 'neutral',
    trendValue: 'No change',
    icon: CheckCircle,
    actionLabel: 'Review',
    actionHref: '/batches',
  },
];

const Sparkline = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  const points = trend === 'up' 
    ? '0,20 10,15 20,10 30,5 40,0'
    : trend === 'down'
    ? '0,0 10,5 20,10 30,15 40,20'
    : '0,10 10,12 20,8 30,10 40,9';
    
  const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <svg className="w-16 h-8" viewBox="0 0 40 20">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        className="opacity-80"
      />
    </svg>
  );
};

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpi.subtitle}
                  </p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' && (
                      <TrendingUp className="h-3 w-3 text-success mr-1" />
                    )}
                    {kpi.trend === 'down' && (
                      <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                    )}
                    <span className={cn(
                      "text-xs",
                      kpi.trend === 'up' && "text-success",
                      kpi.trend === 'down' && "text-destructive",
                      kpi.trend === 'neutral' && "text-muted-foreground"
                    )}>
                      {kpi.trendValue}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Sparkline trend={kpi.trend} />
                  {kpi.actionLabel && kpi.actionHref && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs h-6"
                      onClick={() => window.location.href = kpi.actionHref}
                    >
                      {kpi.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};