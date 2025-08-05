import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Users } from 'lucide-react';

// Initial vendor list. Vendors may be added or removed. This structure
// includes basic contact details that can be extended as needed.
const initialVendors = [
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

/**
 * Vendors page provides CRUD functionality for supplier records. Users can add
 * new vendors via a modal form and remove existing ones from the table.
 */
const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', address: '' });

  // Reactive count of suppliers for summary display. This updates automatically
  // whenever a vendor is added or removed, providing a quick overview of how
  // many suppliers are currently managed.
  const totalVendors = vendors.length;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const nextId = `V-${(vendors.length + 1).toString().padStart(3, '0')}`;
    setVendors([...vendors, { id: nextId, ...form }]);
    setForm({ name: '', contact: '', phone: '', address: '' });
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <Button onClick={() => setModalOpen(true)}>Add Vendor</Button>
      </div>

      {/* Vendor metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vendors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalVendors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active suppliers</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Supplier List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/50">
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.contact}</TableCell>
                  <TableCell>{v.phone}</TableCell>
                  <TableCell>{v.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/vendors/${v.id}`}>View</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No vendors found.
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
              <DialogTitle>Add Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Vendor name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Contact person"
                  value={form.contact}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!form.name || !form.contact}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Vendors;