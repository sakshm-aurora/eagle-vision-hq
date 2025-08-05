import React, { useState } from 'react';
import {
  X,
  Package,
  Clock,
  DollarSign,
  CheckCircle,
  FileText,
  AlertTriangle,
  Download,
  ArrowRight,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  FilePlus,
  Check,
  XCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReserveStockModal from './ReserveStockModal';
import AttachmentUploader, { Attachment } from '@/components/ui/attachment-uploader';

interface Stage {
  /**
   * A unique identifier for the stage. This is used internally for keying
   * in React lists and does not need to follow any particular format.
   */
  id: string;
  /**
   * Human‑readable stage name. Typical values include "Design", "Sampling",
   * "PO Approval", "Sourcing", "Cutting", "Stitching", etc.
   */
  name: string;
  /**
   * Indicates whether the work happens in‑house, at a vendor or a mixture of
   * both. This allows the lifecycle to communicate where each step is
   * executed.
   */
  type: 'in-house' | 'vendor' | 'both';
  /**
   * Status of the stage. Not all batch definitions provide granular status;
   * if omitted, the stage is assumed to be not started.
   */
  status?: 'not-started' | 'in-progress' | 'completed';
  /**
   * Person or team responsible for this step.
   */
  assignedTo?: string;
  /**
   * Approver for this step.
   */
  approver?: string;
  /**
   * Planned start date (YYYY-MM-DD).
   */
  plannedStart?: string;
  /**
   * Planned end date (YYYY-MM-DD).
   */
  plannedEnd?: string;
  /**
   * Actual start date (if work has begun).
   */
  actualStart?: string;
  /**
   * Actual end date (if work has completed).
   */
  actualEnd?: string;
  /**
   * Monetary cost associated with this stage.
   */
  cost?: number;
  /**
   * Attachments uploaded for this stage. Each attachment is an object with
   * metadata provided by the AttachmentUploader component.
   */
  attachments?: Attachment[];
  /**
   * Additional remarks or notes for this stage.
   */
  remarks?: string;
}

interface Batch {
  id: string;
  currentPhase: 'sourcing' | 'stitching' | 'qa' | 'dispatch';
  startDate: string;
  estimatedEnd: string;
  manager: string;
  status: 'on-time' | 'delayed' | 'completed';
  itemsCount: number;
  product: string;
  /**
   * Optional custom lifecycle for this batch. When provided it overrides
   * the default mockStages defined within this file. Each stage follows
   * the Stage interface above. This property is used by the NewBatchModal
   * when users create a bespoke production flow.
   */
  stages?: Stage[];
}

interface BatchDetailModalProps {
  batch: Batch;
  open: boolean;
  onClose: () => void;
}

// Additional inventory entries provide a more realistic bill of materials. Each
// material includes quantities allocated/consumed and a stock location. In
// practice, these values would reflect live inventory data.
const mockMaterials = [
  { name: 'Cotton Fabric', allocated: 250, consumed: 180, remaining: 70, location: 'A-1' },
  { name: 'Polyester Thread', allocated: 50, consumed: 35, remaining: 15, location: 'A-2' },
  { name: 'Buttons', allocated: 500, consumed: 500, remaining: 0, location: 'B-1' },
  { name: 'Denim Fabric', allocated: 600, consumed: 450, remaining: 150, location: 'C-3' },
  { name: 'Zippers', allocated: 200, consumed: 120, remaining: 80, location: 'B-4' },
  { name: 'Leather Pieces', allocated: 400, consumed: 200, remaining: 200, location: 'D-2' },
  { name: 'Silk Rolls', allocated: 300, consumed: 50, remaining: 250, location: 'C-1' },
  { name: 'Elastic Bands', allocated: 500, consumed: 300, remaining: 200, location: 'A-5' },
];

// Define a mock set of stages representing the full manufacturing chain. Each stage
// contains rich metadata including assignments, planned and actual timing,
// costs and attachments. In a real application, this data would come from
// a backend API and be updated as work progresses. For demonstration
// purposes we hardcode a few values here.
// Extend the stage schema with a `type` field indicating whether work is
// performed in‑house, by a vendor or a combination of both. Adding
// additional stages and metadata paints a fuller picture of a typical
// manufacturing lifecycle.
// Default lifecycle used when a batch does not specify its own stages. See
// the Stage interface above for field descriptions. Each stage here
// represents a typical manufacturing process with assignments,
// scheduling and cost information. When a custom lifecycle is passed
// through the batch prop, these defaults are ignored.
const mockStages: Stage[] = [
  {
    id: 'design',
    name: 'Design',
    status: 'completed',
    type: 'in-house',
    assignedTo: 'Design Team',
    approver: 'Creative Manager',
    plannedStart: '2024-01-01',
    plannedEnd: '2024-01-03',
    actualStart: '2024-01-01',
    actualEnd: '2024-01-02',
    cost: 500,
    attachments: [],
    remarks: 'Approved without changes.',
  },
  {
    id: 'sampling',
    name: 'Sampling',
    status: 'completed',
    type: 'in-house',
    assignedTo: 'Sampling Unit',
    approver: 'QA Lead',
    plannedStart: '2024-01-03',
    plannedEnd: '2024-01-05',
    actualStart: '2024-01-03',
    actualEnd: '2024-01-05',
    cost: 300,
    attachments: [],
    remarks: 'Samples validated.',
  },
  {
    id: 'po-approval',
    name: 'PO Approval',
    status: 'completed',
    type: 'in-house',
    assignedTo: 'Finance Team',
    approver: 'CFO',
    plannedStart: '2024-01-05',
    plannedEnd: '2024-01-06',
    actualStart: '2024-01-05',
    actualEnd: '2024-01-06',
    cost: 0,
    attachments: [],
    remarks: 'PO approved for materials.',
  },
  {
    id: 'sourcing',
    name: 'Sourcing',
    status: 'in-progress',
    type: 'vendor',
    assignedTo: 'Acme Fabrics',
    approver: 'Supply Manager',
    plannedStart: '2024-01-06',
    plannedEnd: '2024-01-10',
    actualStart: '2024-01-06',
    cost: 2500,
    attachments: [],
    remarks: 'Materials partially received.',
  },
  {
    id: 'cutting',
    name: 'Cutting',
    status: 'not-started',
    type: 'in-house',
    assignedTo: 'Cutting Unit',
    approver: 'Production Manager',
    plannedStart: '2024-01-10',
    plannedEnd: '2024-01-12',
    cost: 700,
    attachments: [],
  },
  {
    id: 'stitching',
    name: 'Stitching',
    status: 'not-started',
    type: 'both',
    assignedTo: 'Stitching Unit',
    approver: 'Production Manager',
    plannedStart: '2024-01-12',
    plannedEnd: '2024-01-17',
    cost: 1200,
    attachments: [],
  },
  {
    id: 'finishing',
    name: 'Finishing',
    status: 'not-started',
    type: 'in-house',
    assignedTo: 'Finishing Unit',
    approver: 'QA Lead',
    plannedStart: '2024-01-17',
    plannedEnd: '2024-01-19',
    cost: 400,
    attachments: [],
  },
  {
    id: 'qa',
    name: 'QA',
    status: 'not-started',
    type: 'in-house',
    assignedTo: 'QA Team',
    approver: 'QA Manager',
    plannedStart: '2024-01-19',
    plannedEnd: '2024-01-20',
    cost: 300,
    attachments: [],
  },
  {
    id: 'packing',
    name: 'Packing',
    status: 'not-started',
    type: 'vendor',
    assignedTo: 'Packing Unit',
    approver: 'Logistics Manager',
    plannedStart: '2024-01-20',
    plannedEnd: '2024-01-21',
    cost: 200,
    attachments: [],
  },
  {
    id: 'shipping',
    name: 'Shipping',
    status: 'not-started',
    type: 'vendor',
    assignedTo: 'Courier Partner',
    approver: 'Logistics Manager',
    plannedStart: '2024-01-21',
    plannedEnd: '2024-01-22',
    cost: 500,
    attachments: [],
  },
  {
    id: 'labeling',
    name: 'Labeling',
    status: 'not-started',
    type: 'in-house',
    assignedTo: 'Labeling Unit',
    approver: 'QA Lead',
    plannedStart: '2024-01-18',
    plannedEnd: '2024-01-20',
    cost: 150,
    attachments: [],
  },
  {
    id: 'ironing',
    name: 'Ironing',
    status: 'not-started',
    type: 'vendor',
    assignedTo: 'Vendor – Ironing Services',
    approver: 'Production Manager',
    plannedStart: '2024-01-16',
    plannedEnd: '2024-01-17',
    cost: 100,
    attachments: [],
  },
];

// Mock change logs for demonstration. Each entry contains a description,
// current status and optional approver/approval date. In a production
// system these would include audit trails and links back to the user
// who proposed the change.
const mockChangeLogs = [
  {
    id: 'CR-001',
    description: 'Increase batch size from 500 to 600 units',
    status: 'pending',
    proposer: 'Mike Rodriguez',
    date: '2024-01-10',
  },
  {
    id: 'CR-002',
    description: 'Swap supplier for polyester thread',
    status: 'approved',
    proposer: 'Emma Watson',
    date: '2024-01-09',
    approver: 'Supply Manager',
    approvedDate: '2024-01-10',
  },
  // Additional change requests illustrating lifecycle customisation and
  // execution tweaks. These entries have various statuses to show
  // approval and pending flows.
  {
    id: 'CR-003',
    description: 'Add ironing step after finishing',
    status: 'approved',
    proposer: 'Rohan Gupta',
    date: '2024-01-12',
    approver: 'Production Manager',
    approvedDate: '2024-01-13',
  },
  {
    id: 'CR-004',
    description: 'Change execution type for stitching to vendor',
    status: 'pending',
    proposer: 'Priya Singh',
    date: '2024-01-14',
  },
];

const mockTimeline = [
  { timestamp: '2024-01-15 09:00', action: 'Batch created', user: 'Sarah Chen', phase: 'sourcing' },
  { timestamp: '2024-01-16 14:30', action: 'Materials sourced', user: 'Mike Rodriguez', phase: 'sourcing' },
  { timestamp: '2024-01-17 08:00', action: 'Production started', user: 'Emma Watson', phase: 'stitching' },
  { timestamp: '2024-01-20 16:00', action: 'Quality check initiated', user: 'James Liu', phase: 'qa' },
  // Additional timeline entries to cover later phases and other batches. These
  // examples help illustrate how a timeline grows as work progresses.
  { timestamp: '2024-01-21 10:00', action: 'Packing started', user: 'Rohan Gupta', phase: 'dispatch' },
  { timestamp: '2024-01-22 13:00', action: 'Shipped to warehouse', user: 'James Liu', phase: 'dispatch' },
  { timestamp: '2024-02-01 09:00', action: 'Leather Jackets sourcing started', user: 'Rohan Gupta', phase: 'sourcing' },
  { timestamp: '2024-02-15 11:00', action: 'Sports Shorts QA passed', user: 'Priya Singh', phase: 'qa' },
];

const mockQALogs = [
  { id: 1, timestamp: '2024-01-20 16:00', inspector: 'James Liu', result: 'pass', comments: 'All items meet quality standards', defects: 0 },
  { id: 2, timestamp: '2024-01-20 18:30', inspector: 'Anna Smith', result: 'pass', comments: 'Minor stitching adjustments needed on 5 items', defects: 5 },
  // Include an additional QA inspection to showcase repeated checks. The
  // final result indicates a failed inspection with a higher defect count.
  { id: 3, timestamp: '2024-02-15 14:00', inspector: 'Priya Singh', result: 'fail', comments: 'Seam inconsistency found in 12 units', defects: 12 },
];

export const BatchDetailModal: React.FC<BatchDetailModalProps> = ({ batch, open, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  // Maintain attachments that apply to the entire batch. These might include
  // purchase orders, invoices, shipment documents and other proofs of work.
  const [batchAttachments, setBatchAttachments] = useState<Attachment[]>([]);
  // Maintain attachments on a per‑stage basis. Keys correspond to stage IDs.
  const [stageAttachments, setStageAttachments] = useState<Record<string, Attachment[]>>({});
  // Maintain change log state so that approvals/rejections update the view.
  const [changeLogs, setChangeLogs] = useState(mockChangeLogs);

  const handleStageAttachmentsChange = (stageId: string, attachments: Attachment[]) => {
    setStageAttachments((prev) => ({ ...prev, [stageId]: attachments }));
  };

  const handleChangeLogStatus = (id: string, status: string) => {
    setChangeLogs((prev) => prev.map((log) => (log.id === id ? { ...log, status } : log)));
  };

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

  const handleReserveClick = (material: any) => {
    setSelectedMaterial(material);
    setReserveModalOpen(true);
  };

  // Compute the list of stages to display in the timeline tab. If the batch
  // object includes a `stages` property (as produced by the NewBatchModal)
  // and that property is an array, use it directly. Otherwise fall back to
  // the default `mockStages`. Casting via `any` avoids TypeScript errors
  // when batches are defined in other modules without the `stages` field.
  const stagesToShow: Stage[] = Array.isArray((batch as any).stages)
    ? ((batch as any).stages as Stage[])
    : mockStages;

  // Determine simple dependencies based on batch id pattern.
  const computeDependencies = () => {
    // For demonstration, assume batches with incremental numeric suffix depend on previous.
    // Example: B-2024-002 depends on B-2024-001.
    const parts = batch.id.split('-');
    const last = parts[parts.length - 1];
    const num = parseInt(last);
    if (!isNaN(num) && num > 1) {
      const prevId = parts.slice(0, -1).concat(String(num - 1).padStart(last.length, '0')).join('-');
      return [{ from: prevId, to: batch.id }];
    }
    return [];
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
        <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="qa">QA Logs</TabsTrigger>
            <TabsTrigger value="change-log">Change Log</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
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

            {/* Materials tab: display allocated, consumed and remaining quantities for each material with the ability to reserve stock. */}
            <TabsContent value="materials">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Consumed</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Action</TableHead>
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
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReserveClick(material)}
                          disabled={material.remaining === 0}
                        >
                          Reserve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            {/* Timeline tab: show the complete list of stages with assignments, timing and the ability to attach documents per stage. */}
            <TabsContent value="timeline">
              <div className="space-y-4">
                {stagesToShow.map((stage) => {
                  // Determine badge colour based on status. If no status is
                  // provided, treat the stage as not started.
                  let statusClass = 'bg-muted text-muted-foreground';
                  if (stage.status === 'completed') statusClass = 'bg-success text-success-foreground';
                  if (stage.status === 'in-progress') statusClass = 'bg-accent text-accent-foreground';
                  return (
                    <Card key={stage.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-base">{stage.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Assigned to: {stage.assignedTo || '—'} | Approver: {stage.approver || '—'} | Execution: {stage.type?.replace('-', ' ') || '—'}
                            </p>
                          </div>
                          <Badge variant="secondary" className={cn('text-xs', statusClass)}>
                            {(stage.status || 'not-started').replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Planned:</span> {stage.plannedStart || '—'} - {stage.plannedEnd || '—'}
                          </div>
                          <div>
                            <span className="font-medium">Actual:</span> {stage.actualStart || '—'} - {stage.actualEnd || '—'}
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span> {stage.cost ? `$${stage.cost.toLocaleString()}` : '—'}
                          </div>
                        </div>
                        {stage.remarks && (
                          <p className="text-xs text-muted-foreground italic">{stage.remarks}</p>
                        )}
                        <div>
                          <AttachmentUploader
                            label="Upload Document"
                            attachments={stageAttachments[stage.id] || []}
                            onChange={(att) => handleStageAttachmentsChange(stage.id, att)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Financials tab: replace the old Costs tab. Show an extended cost breakdown. */}
            <TabsContent value="financials">
              <div className="space-y-6">
                <CostBreakdown />
                {/* Additional breakdown for BOM estimate and QA costs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>BOM Estimate:</span>
                      <span className="font-medium">$2,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Labor Cost:</span>
                      <span className="font-medium">$1,500</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Overhead:</span>
                      <span className="font-medium">$800</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>QA Cost:</span>
                      <span className="font-medium">$300</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">$4,600</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documents tab: allow users to upload and view files associated with the entire batch. */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Batch Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <AttachmentUploader
                    label="Upload Document"
                    attachments={batchAttachments}
                    onChange={setBatchAttachments}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* QA logs tab remains mostly unchanged, but we wrap it in a card. */}
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

            {/* Change log tab: list proposed modifications with approval workflow. */}
            <TabsContent value="change-log">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Change Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {changeLogs.length === 0 && (
                    <p className="text-sm text-muted-foreground">No change requests.</p>
                  )}
                  {changeLogs.map((req) => (
                    <div key={req.id} className="p-3 border rounded-md space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{req.description}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Proposed by {req.proposer} on {req.date}</p>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => handleChangeLogStatus(req.id, 'approved')}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleChangeLogStatus(req.id, 'rejected')}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      {req.status !== 'pending' && req.approver && req.approvedDate && (
                        <p className="text-xs text-muted-foreground">
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)} by {req.approver} on {req.approvedDate}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dependencies tab: unchanged from previous implementation. */}
            <TabsContent value="dependencies">
              <Card>
                <CardHeader>
                  <CardTitle>Dependencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {computeDependencies().length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No dependencies for this batch.
                    </p>
                  ) : (
                    computeDependencies().map((dep, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-mono text-sm">{dep.from}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-mono text-sm">{dep.to}</span>
                      </div>
                    ))
                  )}
                  <div className="pt-4">
                    <Button variant="link" asChild>
                      <a href="/dependencies" className="text-sm">
                        View All Dependencies
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
      {selectedMaterial && (
        <ReserveStockModal
          material={selectedMaterial}
          open={reserveModalOpen}
          onClose={() => setReserveModalOpen(false)}
          onReserve={(qty) => {
            // Placeholder for reservation logic. In a real app this would update state or notify backend.
            console.log(`Reserved ${qty} units of ${selectedMaterial.name}`);
          }}
        />
      )}
    </Dialog>
  );
};