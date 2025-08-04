import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Basic vendor definitions replicated from the Vendors page. In a real
// application you would fetch this from a shared data store or API. We
// intentionally keep the structure simple for demonstration purposes.
const vendors = [
  {
    id: 'V-001',
    name: 'Acme Fabrics',
    contact: 'John Doe',
    phone: '+91 9876543210',
    address: '123 Textile St, Mumbai',
  },
  {
    id: 'V-002',
    name: 'Global Threads',
    contact: 'Maria Garcia',
    phone: '+91 9123456780',
    address: '456 Sewing Ave, Delhi',
  },
];

// Static performance metrics for each vendor. These figures would be
// calculated dynamically in a production setting based on real job data.
const vendorMetrics: Record<string, any> = {
  'V-001': {
    deliveryTime: 6, // days on average
    costDeviation: 4, // percent over estimate
    qaPassRate: 97, // percent
    communicationDelay: 1, // days on average
    contributions: {
      Sourcing: 3,
      Stitching: 0,
      QA: 1,
    },
    batches: [
      { id: 'B-2024-001', stage: 'Sourcing', cost: 2500, qaResult: 'Pass' },
      { id: 'B-2024-003', stage: 'QA', cost: 300, qaResult: 'Pass' },
    ],
  },
  'V-002': {
    deliveryTime: 8,
    costDeviation: 2,
    qaPassRate: 92,
    communicationDelay: 2,
    contributions: {
      Sourcing: 2,
      Stitching: 1,
      QA: 0,
    },
    batches: [
      { id: 'B-2024-002', stage: 'Stitching', cost: 1200, qaResult: 'Fail' },
    ],
  },
};

const VendorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vendor = vendors.find((v) => v.id === id);
  const metrics = vendorMetrics[id || ''] || null;

  if (!vendor || !metrics) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Vendor Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any data for the requested vendor.
        </p>
        <Button asChild className="mt-4">
          <Link to="/vendors">Back to Vendors</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor {vendor.id}</h1>
          <p className="text-muted-foreground">Performance analytics for {vendor.name}</p>
        </div>
        <Button asChild>
          <Link to="/vendors">Back to Vendors</Link>
        </Button>
      </div>

      {/* Vendor Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{vendor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contact</span>
            <span className="font-medium">{vendor.contact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{vendor.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium">{vendor.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.deliveryTime} <span className="text-base font-normal">days</span>
            </div>
            <p className="text-xs text-muted-foreground">Lower is better</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Deviation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.costDeviation}%
            </div>
            <p className="text-xs text-muted-foreground">Difference vs estimate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QA Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.qaPassRate}%
            </div>
            <p className="text-xs text-muted-foreground">Across inspections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.communicationDelay} <span className="text-base font-normal">days</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg. time to respond</p>
          </CardContent>
        </Card>
      </div>

      {/* Contributions by stage */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(metrics.contributions).map(([stage, count]) => (
              <div key={stage} className="flex flex-col items-start">
                <span className="text-muted-foreground">{stage}</span>
                <span className="font-medium">{count} job{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs list */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Batches</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Batch</TableHead>
                <TableHead className="w-40">Stage</TableHead>
                <TableHead className="w-32">Cost</TableHead>
                <TableHead className="w-32">QA Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.batches.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.stage}</TableCell>
                  <TableCell>${item.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={item.qaResult === 'Pass' ? 'default' : 'destructive'}>
                      {item.qaResult}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {metrics.batches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No assigned batches.
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

export default VendorDetail;