import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Batch {
  id: string;
  currentPhase: string;
  startDate: string;
  estimatedEnd: string;
  manager: string;
  status: string;
  itemsCount: number;
  product: string;
}

// Reuse the mock batches from the Batches page. In a real scenario this
// would come from a shared store or API call. Here we define a small
// sample set to illustrate the kanban structure.
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
  // New batches for the kanban board. They cover a broader set of products
  // and statuses while retaining the same high‑level phase values used for
  // grouping. If your process introduces entirely new phases, update
  // `phaseToStage` and `stages` accordingly.
  {
    id: 'B-2024-005',
    currentPhase: 'stitching',
    startDate: '2024-02-01',
    estimatedEnd: '2024-02-20',
    manager: 'Rohan Gupta',
    status: 'delayed',
    itemsCount: 350,
    product: 'Leather Jackets',
  },
  {
    id: 'B-2024-006',
    currentPhase: 'qa',
    startDate: '2024-02-05',
    estimatedEnd: '2024-02-22',
    manager: 'Priya Singh',
    status: 'on-time',
    itemsCount: 600,
    product: 'Sports Shorts',
  },
  {
    id: 'B-2024-007',
    currentPhase: 'stitching',
    startDate: '2024-01-25',
    estimatedEnd: '2024-02-15',
    manager: 'Aarav Patel',
    status: 'delayed',
    itemsCount: 450,
    product: 'Hoodies',
  },
  {
    id: 'B-2024-008',
    currentPhase: 'sourcing',
    startDate: '2024-02-10',
    estimatedEnd: '2024-02-28',
    manager: 'Neha Sharma',
    status: 'on-time',
    itemsCount: 250,
    product: 'Silk Scarves',
  },
  {
    id: 'B-2024-009',
    currentPhase: 'qa',
    startDate: '2024-02-12',
    estimatedEnd: '2024-03-01',
    manager: 'Vikram Desai',
    status: 'on-time',
    itemsCount: 400,
    product: 'Kids Pajamas',
  },
  {
    id: 'B-2024-010',
    currentPhase: 'dispatch',
    startDate: '2024-02-15',
    estimatedEnd: '2024-03-05',
    manager: 'Rashmi Chawla',
    status: 'completed',
    itemsCount: 700,
    product: 'Formal Pants',
  },
];

// Map each basic phase to a more detailed manufacturing stage for the kanban.
const phaseToStage: Record<string, string> = {
  sourcing: 'Sourcing',
  stitching: 'Stitching',
  qa: 'QA',
  dispatch: 'Shipping',
};

const stages: string[] = [
  'Design',
  'Sampling',
  'PO Approval',
  'Sourcing',
  'Cutting',
  'Stitching',
  'Finishing',
  'QA',
  'Packing',
  'Shipping',
];

/**
 * Kanban page shows batches organised by their current stage in the process.
 * It provides a quick overview of where work is concentrated and highlights
 * any bottlenecks. Drag and drop is not implemented; this is a read-only
 * view for demonstration purposes.
 */
const Kanban: React.FC = () => {
  // Group batches by stage. Any stage without batches will show an empty column.
  const columns: Record<string, Batch[]> = {};
  stages.forEach((stage) => {
    columns[stage] = [];
  });
  mockBatches.forEach((batch) => {
    const stage = phaseToStage[batch.currentPhase] || 'Sourcing';
    if (!columns[stage]) columns[stage] = [];
    columns[stage].push(batch);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="text-xs bg-success text-success-foreground">On Time</Badge>;
      case 'delayed':
        return <Badge className="text-xs bg-destructive text-destructive-foreground">Delayed</Badge>;
      case 'completed':
        return <Badge className="text-xs bg-accent text-accent-foreground">Completed</Badge>;
      default:
        return <Badge className="text-xs bg-muted text-muted-foreground">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-x-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground">
            See where each batch resides in the manufacturing process
          </p>
        </div>
      </div>
      <div className="grid grid-flow-col auto-cols-max gap-4">
        {stages.map((stage) => (
          <div key={stage} className="w-72 flex flex-col">
            <div className="px-3 py-2 bg-muted rounded-t-lg">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {stage}
              </h3>
            </div>
            <div className="flex-1 space-y-3 p-3 bg-card border rounded-b-lg min-h-[5rem]">
              {columns[stage] && columns[stage].length > 0 ? (
                columns[stage].map((batch) => (
                  <Card key={batch.id} className="border border-border shadow-sm">
                    <CardContent className="p-3 space-y-1 text-xs">
                      <div className="font-medium text-sm">{batch.id}</div>
                      <div className="text-muted-foreground truncate">
                        {batch.product} ({batch.itemsCount} units)
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{batch.manager}</span>
                        {getStatusBadge(batch.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No batches</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;