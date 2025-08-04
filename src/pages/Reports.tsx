import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, Table, Download, Calendar, Play, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface ReportField {
  id: string;
  name: string;
  type: 'dimension' | 'measure';
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  schedule: string;
  chartType: string;
}

const availableFields: ReportField[] = [
  { id: 'batch_id', name: 'Batch ID', type: 'dimension' },
  { id: 'phase_duration', name: 'Phase Duration', type: 'measure' },
  { id: 'cost', name: 'Cost', type: 'measure' },
  { id: 'stock_usage', name: 'Stock Usage', type: 'measure' },
  { id: 'date_range', name: 'Date Range', type: 'dimension' },
  { id: 'manager', name: 'Manager', type: 'dimension' },
  { id: 'product_type', name: 'Product Type', type: 'dimension' },
  { id: 'yield_percentage', name: 'Yield %', type: 'measure' },
];

const savedReports: SavedReport[] = [
  {
    id: '1',
    name: 'Weekly Production Summary',
    description: 'Overview of production metrics for the past week',
    lastRun: '2024-01-20 09:00',
    schedule: 'Weekly',
    chartType: 'Bar Chart',
  },
  {
    id: '2',
    name: 'Monthly Cost Analysis',
    description: 'Detailed cost breakdown by batch and material',
    lastRun: '2024-01-01 08:00',
    schedule: 'Monthly',
    chartType: 'Line Chart',
  },
  {
    id: '3',
    name: 'Inventory Movement Report',
    description: 'Track inventory consumption and restocking patterns',
    lastRun: '2024-01-19 18:00',
    schedule: 'Daily',
    chartType: 'Table',
  },
];

const Reports = () => {
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([]);
  const [chartType, setChartType] = useState('table');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'available' && result.destination.droppableId === 'selected') {
      const field = availableFields.find(f => f.id === result.draggableId);
      if (field && !selectedFields.find(f => f.id === field.id)) {
        setSelectedFields([...selectedFields, field]);
      }
    } else if (result.source.droppableId === 'selected' && result.destination.droppableId === 'available') {
      setSelectedFields(selectedFields.filter(f => f.id !== result.draggableId));
    }
  };

  const PreviewChart = () => {
    const mockData = [
      { batch: 'B-2024-001', cost: 4800, duration: 7, yield: 92 },
      { batch: 'B-2024-002', cost: 7500, duration: 9, yield: 88 },
      { batch: 'B-2024-003', cost: 10800, duration: 10, yield: 95 },
    ];

    if (chartType === 'table') {
      return (
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>Yield %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.batch}>
                <TableCell>{row.batch}</TableCell>
                <TableCell>${row.cost.toLocaleString()}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.yield}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      );
    }

    if (chartType === 'bar') {
      return (
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground mb-4">
            Cost by Batch
          </div>
          {mockData.map((item, index) => (
            <div key={item.batch} className="flex items-center gap-3">
              <span className="text-sm w-20">{item.batch}</span>
              <div className="flex-1 bg-muted rounded-full h-6 relative">
                <div 
                  className="bg-primary h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(item.cost / 12000) * 100}%` }}
                >
                  <span className="text-xs text-primary-foreground">
                    ${item.cost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center text-muted-foreground py-8">
        Preview will be generated based on selected fields and chart type
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Build custom reports and schedule automated delivery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-2 gap-6">
                  {/* Available Fields */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Available Fields
                    </Label>
                    <Droppable droppableId="available">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="border rounded-lg p-3 min-h-[200px] space-y-2"
                        >
                          {availableFields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-secondary rounded border cursor-move hover:bg-secondary-hover"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{field.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {field.type}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                  {/* Selected Fields */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Selected Fields
                    </Label>
                    <Droppable droppableId="selected">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="border rounded-lg p-3 min-h-[200px] space-y-2"
                        >
                          {selectedFields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-primary/10 rounded border cursor-move"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{field.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {field.type}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {selectedFields.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm py-8">
                              Drag fields here to build your report
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Chart Type</Label>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="table">
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4" />
                            Table
                          </div>
                        </SelectItem>
                        <SelectItem value="bar">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Bar Chart
                          </div>
                        </SelectItem>
                        <SelectItem value="line">
                          <div className="flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            Line Chart
                          </div>
                        </SelectItem>
                        <SelectItem value="pie">
                          <div className="flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            Pie Chart
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Preview Report
                    </Button>
                    <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Report
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </DragDropContext>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <PreviewChart />
            </CardContent>
          </Card>
        </div>

        {/* Saved Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Last run: {report.lastRun}
                    </span>
                    <Badge variant="outline">{report.schedule}</Badge>
                  </div>
                  <Button size="sm" className="w-full">
                    <Play className="h-3 w-3 mr-1" />
                    Run Now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Name</Label>
              <Input placeholder="Enter report name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe this report" />
            </div>
            <div>
              <Label>Schedule</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email Recipients</Label>
              <Textarea placeholder="Enter email addresses separated by commas" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button>Schedule Report</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;