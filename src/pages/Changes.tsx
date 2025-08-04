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

// Initial change request list. Each request can be approved or rejected.
const initialRequests = [
  {
    id: 'CR-001',
    description: 'Increase batch size for B-2024-001 from 1000 to 1200 units',
    status: 'pending',
  },
  {
    id: 'CR-002',
    description: 'Swap supplier for polyester thread on upcoming orders',
    status: 'approved',
  },
];

/**
 * Changes page lists proposed modifications to production and allows
 * supervisors to approve or reject pending requests. Simple status updates
 * are implemented here; real workflows would include audit logging and
 * notifications.
 */
const Changes: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);

  const updateStatus = (id: string, newStatus: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Change Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Proposed Changes</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/50">
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell className="capitalize">{req.status}</TableCell>
                  <TableCell>
                    {req.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateStatus(req.id, 'approved')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(req.id, 'rejected')}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      '--'
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No change requests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Changes;