import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { BatchDetailModal } from '@/components/batches/BatchDetailModal';

// Mock alert data. In production, alerts would be loaded from the backend.
const mockAlerts = [
  {
    id: 'A-001',
    type: 'system',
    severity: 'info',
    message: 'New update available',
    timestamp: '2024-01-10 09:00',
    batchId: null,
  },
  {
    id: 'A-002',
    type: 'batch',
    severity: 'warning',
    message: 'Batch B-2024-002 delayed due to supply issue',
    timestamp: '2024-01-16 12:30',
    batchId: 'B-2024-002',
  },
  {
    id: 'A-003',
    type: 'inventory',
    severity: 'critical',
    message: 'Low stock alert: Polyester Thread',
    timestamp: '2024-01-17 08:00',
    batchId: null,
  },
];

// A minimal mock batch dataset for linking alerts to batch details. Only batches
// referenced by alerts need to be included here. If no batchId is present
// in an alert, clicking does nothing.
const mockBatches = [
  {
    id: 'B-2024-002',
    currentPhase: 'stitching' as const,
    startDate: '2024-01-18',
    estimatedEnd: '2024-02-03',
    manager: 'James Liu',
    status: 'delayed' as const,
    itemsCount: 800,
    product: 'Pants',
  },
];

/**
 * Alerts page showing a list of system, batch and inventory notifications. Users
 * can filter by type and severity and search within messages. Clicking the
 * batch ID in a row opens the corresponding batch detail modal. This page
 * centralizes all notifications so they are not missed in the dashboard.
 */
const Alerts: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<typeof mockBatches[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenBatch = (batchId: string | null) => {
    if (!batchId) return;
    const batch = mockBatches.find((b) => b.id === batchId);
    if (batch) {
      setSelectedBatch(batch);
      setModalOpen(true);
    }
  };

  const filtered = mockAlerts.filter((alert) => {
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesQuery = alert.message.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesSeverity && matchesQuery;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="batch">Batch</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="w-full md:w-60"
          placeholder="Search alerts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead className="w-32">Type</TableHead>
                <TableHead className="w-32">Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead className="w-28">Batch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-muted/50">
                  <TableCell>{alert.id}</TableCell>
                  <TableCell className="capitalize">{alert.type}</TableCell>
                  <TableCell className="capitalize">{alert.severity}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.timestamp}</TableCell>
                  <TableCell>
                    {alert.batchId ? (
                      <Button variant="link" className="p-0 text-primary" onClick={() => handleOpenBatch(alert.batchId!)}>
                        {alert.batchId}
                      </Button>
                    ) : (
                      '--'
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No alerts matching filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedBatch && (
        <BatchDetailModal batch={selectedBatch} open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Alerts;