import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BatchCost {
  id: string;
  product: string;
  materialsCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  revenue: number;
  margin: number;
  status: string;
  completedDate: string;
}

const mockCostData: BatchCost[] = [
  {
    id: 'B-2024-001',
    product: 'Cotton T-Shirts',
    materialsCost: 2500,
    laborCost: 1500,
    overheadCost: 800,
    totalCost: 4800,
    revenue: 6000,
    margin: 20,
    status: 'completed',
    completedDate: '2024-01-20',
  },
  {
    id: 'B-2024-002',
    product: 'Denim Jeans',
    materialsCost: 4200,
    laborCost: 2100,
    overheadCost: 1200,
    totalCost: 7500,
    revenue: 9000,
    margin: 16.7,
    status: 'in-progress',
    completedDate: '',
  },
  {
    id: 'B-2024-003',
    product: 'Winter Jackets',
    materialsCost: 6000,
    laborCost: 3000,
    overheadCost: 1800,
    totalCost: 10800,
    revenue: 15000,
    margin: 28,
    status: 'completed',
    completedDate: '2024-01-18',
  },
];

const Costs = () => {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editableOverhead, setEditableOverhead] = useState<{[key: string]: number}>({});

  const totalRevenue = mockCostData.reduce((sum, batch) => sum + batch.revenue, 0);
  const totalCosts = mockCostData.reduce((sum, batch) => sum + batch.totalCost, 0);
  const averageMargin = mockCostData.reduce((sum, batch) => sum + batch.margin, 0) / mockCostData.length;

  const handleOverheadChange = (batchId: string, value: number) => {
    setEditableOverhead(prev => ({
      ...prev,
      [batchId]: value
    }));
  };

  const CostBreakdownChart = () => {
    const totalMaterials = mockCostData.reduce((sum, batch) => sum + batch.materialsCost, 0);
    const totalLabor = mockCostData.reduce((sum, batch) => sum + batch.laborCost, 0);
    const totalOverhead = mockCostData.reduce((sum, batch) => sum + batch.overheadCost, 0);
    const total = totalMaterials + totalLabor + totalOverhead;

    const materialPercent = (totalMaterials / total) * 100;
    const laborPercent = (totalLabor / total) * 100;
    const overheadPercent = (totalOverhead / total) * 100;

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">${total.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Costs</div>
        </div>
        
        {/* Simple donut chart representation */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="hsl(var(--batch-sourcing))"
              strokeWidth="4"
              strokeDasharray={`${materialPercent} ${100 - materialPercent}`}
              strokeDashoffset="0"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="hsl(var(--batch-stitching))"
              strokeWidth="4"
              strokeDasharray={`${laborPercent} ${100 - laborPercent}`}
              strokeDashoffset={`-${materialPercent}`}
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="hsl(var(--batch-qa))"
              strokeWidth="4"
              strokeDasharray={`${overheadPercent} ${100 - overheadPercent}`}
              strokeDashoffset={`-${materialPercent + laborPercent}`}
            />
          </svg>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-batch-sourcing rounded-full"></div>
              <span>Materials</span>
            </div>
            <span className="font-medium">${totalMaterials.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-batch-stitching rounded-full"></div>
              <span>Labor</span>
            </div>
            <span className="font-medium">${totalLabor.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-batch-qa rounded-full"></div>
              <span>Overhead</span>
            </div>
            <span className="font-medium">${totalOverhead.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Costs</h1>
          <p className="text-muted-foreground">
            Track batch costs and profit margins
          </p>
        </div>
        <Button onClick={() => setShowBudgetModal(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Adjust Budget
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCosts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 25%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart />
          </CardContent>
        </Card>

        {/* Batch Costs Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Batch Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead>Labor</TableHead>
                    <TableHead>Overhead</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCostData.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.product}</TableCell>
                      <TableCell>${batch.materialsCost.toLocaleString()}</TableCell>
                      <TableCell>${batch.laborCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editableOverhead[batch.id] ?? batch.overheadCost}
                          onChange={(e) => handleOverheadChange(batch.id, parseInt(e.target.value))}
                          className="w-20 h-8"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${batch.totalCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-success">
                        ${batch.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={batch.margin > 20 ? "default" : batch.margin > 10 ? "secondary" : "destructive"}
                        >
                          {batch.margin}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Adjustment Modal */}
      <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Monthly Material Budget</Label>
              <Input type="number" defaultValue="15000" />
            </div>
            <div>
              <Label>Monthly Labor Budget</Label>
              <Input type="number" defaultValue="8000" />
            </div>
            <div>
              <Label>Monthly Overhead Budget</Label>
              <Input type="number" defaultValue="4000" />
            </div>
            <div>
              <Label>Target Margin %</Label>
              <Input type="number" defaultValue="25" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBudgetModal(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Costs;