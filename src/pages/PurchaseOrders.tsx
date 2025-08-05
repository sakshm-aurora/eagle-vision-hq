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
import { ClipboardList, Clock, CheckCircle, DollarSign } from 'lucide-react';

// Compute summary statistics for purchase orders to display at the top of the page.
// These derive from the current list of purchase orders (pos state) and help
// provide a quick overview of workload and spend at a glance. They mirror
// the dashboard’s card style for consistency across pages.

// Initial mock data for purchase orders. Each PO has an ID and some basic
// metadata. In a complete system this would be loaded from the server.
const initialPOs = [
  {
    id: 'PO-1001',
    supplier: 'Acme Fabrics',
    date: '2024-01-05',
    total: 2500,
    status: 'pending',
  },
  {
    id: 'PO-1002',
    supplier: 'Global Threads',
    date: '2024-01-12',
    total: 4800,
    status: 'approved',
  },
];

/**
 * PurchaseOrders page lists all purchase orders and allows creation of new
 * orders through a modal form. While simplified, the structure shows how
 * entries might be added to a table and provides a starting point for
 * integrating with a backend.
 */
const PurchaseOrders: React.FC = () => {
  const [pos, setPos] = useState(initialPOs);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ supplier: '', date: '', total: '', status: 'pending' });

  // Updates the local form state as the user types. Because the Input
  // component value is controlled, we need to cast the target value.
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // When the user confirms creation, append a new order to the list. In a real
  // application this would involve validation and an API call.
  const handleCreate = () => {
    const nextId = `PO-${(1000 + pos.length + 1).toString().padStart(3, '0')}`;
    setPos([...pos, { id: nextId, supplier: form.supplier, date: form.date, total: Number(form.total), status: form.status }]);
    setForm({ supplier: '', date: '', total: '', status: 'pending' });
    setModalOpen(false);
  };

  // Derived metrics for KPIs shown at the top of the page. Because these
  // derive from the reactive state `pos`, they update whenever orders are
  // created. Having high level metrics improves scannability and aligns
  // this page with the visual language of the dashboard.
  const totalOrders = pos.length;
  const pendingOrders = pos.filter((po) => po.status === 'pending').length;
  const approvedOrders = pos.filter((po) => po.status === 'approved').length;
  const totalSpend = pos.reduce((acc, po) => acc + po.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Button onClick={() => setModalOpen(true)}>Create PO</Button>
      </div>

      {/* Purchase order metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All purchase orders</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0}% pending
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {approvedOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalOrders > 0 ? Math.round((approvedOrders / totalOrders) * 100) : 0}% approved
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spend
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹{totalSpend.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined order value</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="w-32">Total ($)</TableHead>
                <TableHead className="w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po) => (
                <TableRow key={po.id} className="hover:bg-muted/50">
                  <TableCell>{po.id}</TableCell>
                  <TableCell>{po.supplier}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{po.total.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{po.status}</TableCell>
                </TableRow>
              ))}
              {pos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No purchase orders available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="Supplier name"
                  value={form.supplier}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="total">Total ($)</Label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  min="0"
                  value={form.total}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!form.supplier || !form.date || !form.total}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PurchaseOrders;