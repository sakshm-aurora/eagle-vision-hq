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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// A simple set of resources (machines or personnel) to manage scheduling.
const initialResources = [
  {
    id: 'R-01',
    type: 'Machine',
    name: 'Sewing Machine 1',
    status: 'available',
    assignedBatch: null as string | null,
  },
  {
    id: 'R-02',
    type: 'Machine',
    name: 'Cutting Machine',
    status: 'in-use',
    assignedBatch: 'B-2024-001',
  },
  {
    id: 'R-03',
    type: 'Staff',
    name: 'Jane Cooper',
    status: 'available',
    assignedBatch: null as string | null,
  },
];

/**
 * Resources page allows assignment of machines or staff to batches. For
 * simplicity this example uses a modal to assign a selected resource to a
 * specified batch ID. Real implementations would include date and time
 * pickers and integration with calendars.
 */
const Resources: React.FC = () => {
  const [resources, setResources] = useState(initialResources);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<typeof initialResources[0] | null>(null);
  const [batchId, setBatchId] = useState('');

  const openAssignModal = (resource: typeof initialResources[0]) => {
    setSelectedResource(resource);
    setBatchId(resource.assignedBatch || '');
    setModalOpen(true);
  };

  const handleAssign = () => {
    if (!selectedResource) return;
    setResources((prev) =>
      prev.map((res) =>
        res.id === selectedResource.id ? { ...res, assignedBatch: batchId, status: batchId ? 'in-use' : 'available' } : res
      )
    );
    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resource Scheduling</h1>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Assigned Batch</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((res) => (
                <TableRow key={res.id} className="hover:bg-muted/50">
                  <TableCell>{res.id}</TableCell>
                  <TableCell>{res.type}</TableCell>
                  <TableCell>{res.name}</TableCell>
                  <TableCell className="capitalize">{res.status}</TableCell>
                  <TableCell>{res.assignedBatch || '--'}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openAssignModal(res)}>
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {resources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No resources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedResource && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm">
                Assigning: <span className="font-medium">{selectedResource.name}</span>
              </p>
              <div>
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                  id="batchId"
                  name="batchId"
                  placeholder="e.g. B-2024-005"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssign}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Resources;