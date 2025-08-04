import React, { useState } from 'react';
import { X, Package, Clock, DollarSign, CheckCircle, FileText, AlertTriangle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Batch {
  id: string;
  currentPhase: 'sourcing' | 'stitching' | 'qa' | 'dispatch';
  startDate: string;
  estimatedEnd: string;
  manager: string;
  status: 'on-time' | 'delayed' | 'completed';
  itemsCount: number;
  product: string;
}

interface BatchDetailModalProps {
  batch: Batch;
  open: boolean;
  onClose: () => void;
}

const mockMaterials = [
  { name: 'Cotton Fabric', allocated: 250, consumed: 180, remaining: 70, location: 'A-1' },
  { name: 'Polyester Thread', allocated: 50, consumed: 35, remaining: 15, location: 'A-2' },
  { name: 'Buttons', allocated: 500, consumed: 500, remaining: 0, location: 'B-1' },
];

const mockTimeline = [
  { timestamp: '2024-01-15 09:00', action: 'Batch created', user: 'Sarah Chen', phase: 'sourcing' },
  { timestamp: '2024-01-16 14:30', action: 'Materials sourced', user: 'Mike Rodriguez', phase: 'sourcing' },
  { timestamp: '2024-01-17 08:00', action: 'Production started', user: 'Emma Watson', phase: 'stitching' },
  { timestamp: '2024-01-20 16:00', action: 'Quality check initiated', user: 'James Liu', phase: 'qa' },
];

const mockQALogs = [
  { id: 1, timestamp: '2024-01-20 16:00', inspector: 'James Liu', result: 'pass', comments: 'All items meet quality standards', defects: 0 },
  { id: 2, timestamp: '2024-01-20 18:30', inspector: 'Anna Smith', result: 'pass', comments: 'Minor stitching adjustments needed on 5 items', defects: 5 },
];

export const BatchDetailModal: React.FC<BatchDetailModalProps> = ({ batch, open, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getPhaseProgress = (currentPhase: string) => {
    const phases = ['sourcing', 'stitching', 'qa', 'dispatch'];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const CostBreakdown = () => {
    const costs = {
      materials: 2500,
      labor: 1500,
      overhead: 800,
    };
    const total = costs.materials + costs.labor + costs.overhead;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Materials</div>
              <div className="text-2xl font-bold">${costs.materials.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Labor</div>
              <div className="text-2xl font-bold">${costs.labor.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Overhead</div>
              <div className="text-2xl font-bold">${costs.overhead.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Cumulative Spend Over Time</div>
          <div className="h-32 bg-muted rounded flex items-end p-4">
            <div className="flex-1 space-x-2 flex items-end">
              {[1000, 2200, 3500, 4800].map((value, index) => (
                <div key={index} className="flex-1 bg-primary rounded-t" style={{ height: `${(value / 5000) * 100}%` }}>
                  <div className="text-xs text-center text-primary-foreground pt-1">
                    ${value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Batch {batch.id}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="qa">QA Logs</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{Math.round(getPhaseProgress(batch.currentPhase))}%</div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                      </div>
                      <Progress value={getPhaseProgress(batch.currentPhase)} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sourcing</span>
                        <span>Stitching</span>
                        <span>QA</span>
                        <span>Dispatch</span>
                      </div>
                      <Badge 
                        className={cn(
                          "w-full justify-center",
                          batch.currentPhase === 'sourcing' && "bg-batch-sourcing",
                          batch.currentPhase === 'stitching' && "bg-batch-stitching",
                          batch.currentPhase === 'qa' && "bg-batch-qa",
                          batch.currentPhase === 'dispatch' && "bg-batch-dispatch"
                        )}
                      >
                        Current Phase: {batch.currentPhase.charAt(0).toUpperCase() + batch.currentPhase.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items Produced:</span>
                      <span className="font-medium">420 / {batch.itemsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Yield Rate:</span>
                      <span className="font-medium text-success">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resource Utilization:</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager:</span>
                      <span className="font-medium">{batch.manager}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  disabled={batch.currentPhase === 'dispatch'}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Advance Phase
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Consumed</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMaterials.map((material, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.allocated}</TableCell>
                      <TableCell>{material.consumed}</TableCell>
                      <TableCell className={material.remaining === 0 ? "text-destructive" : ""}>
                        {material.remaining}
                      </TableCell>
                      <TableCell>{material.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="space-y-4">
                {mockTimeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.action}</h4>
                        <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">by {event.user}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {event.phase}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="costs">
              <CostBreakdown />
            </TabsContent>

            <TabsContent value="qa">
              <div className="space-y-4">
                {mockQALogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {log.result === 'pass' ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="font-medium">Inspection #{log.id}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm mb-2">{log.comments}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Inspector: {log.inspector}</span>
                        <span>Defects: {log.defects}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};