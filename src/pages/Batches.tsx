import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BatchDetailModal } from '@/components/batches/BatchDetailModal';
import { NewBatchModal } from '@/components/batches/NewBatchModal';
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

const mockBatches: Batch[] = [
  {
    id: 'B-2024-001',
    currentPhase: 'qa',
    startDate: '2024-01-15',
    estimatedEnd: '2024-01-22',
    manager: 'Sarah Chen',
    status: 'on-time',
    itemsCount: 500,
    product: 'Cotton T-Shirts',
  },
  {
    id: 'B-2024-002', 
    currentPhase: 'stitching',
    startDate: '2024-01-16',
    estimatedEnd: '2024-01-25',
    manager: 'Mike Rodriguez',
    status: 'delayed',
    itemsCount: 300,
    product: 'Denim Jeans',
  },
  {
    id: 'B-2024-003',
    currentPhase: 'sourcing',
    startDate: '2024-01-18',
    estimatedEnd: '2024-01-28',
    manager: 'Emma Watson',
    status: 'on-time',
    itemsCount: 200,
    product: 'Winter Jackets',
  },
  {
    id: 'B-2024-004',
    currentPhase: 'dispatch',
    startDate: '2024-01-20',
    estimatedEnd: '2024-01-30',
    manager: 'James Liu',
    status: 'completed',
    itemsCount: 400,
    product: 'Summer Dresses',
  },
];

// Derive summary statistics for display at the top of the page. These values
// are calculated from the mockBatches array so they automatically update
// whenever the underlying data changes. Showing high‑level metrics helps
// convey important information at a glance and mirrors the dashboard’s
// visual language.
const totalBatches = mockBatches.length;
const onTimeCount = mockBatches.filter((b) => b.status === 'on-time').length;
const delayedCount = mockBatches.filter((b) => b.status === 'delayed').length;
const completedCount = mockBatches.filter((b) => b.status === 'completed').length;

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'sourcing': return 'bg-batch-sourcing text-white';
    case 'stitching': return 'bg-batch-stitching text-white';
    case 'qa': return 'bg-batch-qa text-white';
    case 'dispatch': return 'bg-batch-dispatch text-white';
    default: return 'bg-muted';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-time': return 'bg-success text-success-foreground';
    case 'delayed': return 'bg-destructive text-destructive-foreground';
    case 'completed': return 'bg-accent text-accent-foreground';
    default: return 'bg-muted';
  }
};

const Batches = () => {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);

  const filteredBatches = mockBatches.filter(batch =>
    batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBatches(filteredBatches.map(batch => batch.id));
    } else {
      setSelectedBatches([]);
    }
  };

  const handleSelectBatch = (batchId: string, checked: boolean) => {
    if (checked) {
      setSelectedBatches([...selectedBatches, batchId]);
    } else {
      setSelectedBatches(selectedBatches.filter(id => id !== batchId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground">
            Manage production batches and track progress
          </p>
        </div>
        <Button onClick={() => setShowNewBatchModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* High level batch metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Batches
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalBatches}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all statuses
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On Time
            </CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {onTimeCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBatches > 0 ? Math.round((onTimeCount / totalBatches) * 100) : 0}% on schedule
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delayed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {delayedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBatches > 0 ? Math.round((delayedCount / totalBatches) * 100) : 0}% delayed
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {completedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBatches > 0 ? Math.round((completedCount / totalBatches) * 100) : 0}% finished
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Batches</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="sourcing">Sourcing</SelectItem>
                  <SelectItem value="stitching">Stitching</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="dispatch">Dispatch</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-time">On Time</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedBatches.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-sm text-muted-foreground">
                {selectedBatches.length} selected
              </span>
              <Button variant="outline" size="sm">
                Advance Phase
              </Button>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                Delete
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBatches.length === filteredBatches.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current Phase</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Estimated End</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedBatches.includes(batch.id)}
                      onCheckedChange={(checked) => handleSelectBatch(batch.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{batch.product}</span>
                      <div className="text-xs text-muted-foreground">
                        {batch.itemsCount} units
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getPhaseColor(batch.currentPhase))}>
                      {batch.currentPhase.charAt(0).toUpperCase() + batch.currentPhase.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(batch.estimatedEnd).toLocaleDateString()}</TableCell>
                  <TableCell>{batch.manager}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getStatusColor(batch.status))}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBatch(batch)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Batch
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedBatch && (
        <BatchDetailModal
          batch={selectedBatch}
          open={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}

      <NewBatchModal
        open={showNewBatchModal}
        onClose={() => setShowNewBatchModal(false)}
      />
    </div>
  );
};

export default Batches;