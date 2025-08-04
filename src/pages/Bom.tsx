import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define a type for BOM components. Each component may have child components
// allowing for multi-level nesting. Quantity is optional at this demo stage.
interface BomItem {
  name: string;
  quantity?: number;
  children?: BomItem[];
}

// Some initial BOM data to demonstrate nested structures. In practice this
// would be built dynamically or loaded from the backend.
const initialBom: BomItem[] = [
  {
    name: 'Garment',
    children: [
      { name: 'Body', quantity: 1 },
      {
        name: 'Sleeve',
        quantity: 2,
        children: [{ name: 'Cuff', quantity: 2 }],
      },
    ],
  },
];

/**
 * Bom page provides a rudimentary tree editor for multi-level bill of
 * materials (BOM). Users can add components at the root or under a
 * selected parent node. Indentation is achieved via inline padding to
 * avoid dynamic class names which Tailwind cannot compile.
 */
const Bom: React.FC = () => {
  const [bom, setBom] = useState<BomItem[]>(initialBom);
  const [modalOpen, setModalOpen] = useState(false);
  const [parentPath, setParentPath] = useState<number[]>([]);
  const [form, setForm] = useState({ name: '', quantity: '' });

  // Recursively render the BOM tree. Provide an Add Child button on each
  // node to allow inserting below that node.
  const renderTree = (items: BomItem[], path: number[] = [], depth = 0) => {
    return items.map((item, index) => {
      const currentPath = [...path, index];
      return (
        <div key={currentPath.join('-')} style={{ paddingLeft: depth * 16 }} className="space-y-1">
          <div className="flex items-center gap-2">
            <span>
              {item.name}
              {item.quantity ? ` (x${item.quantity})` : ''}
            </span>
            <Button size="sm" variant="secondary" onClick={() => openModal(currentPath)}>
              Add Child
            </Button>
          </div>
          {item.children && renderTree(item.children, currentPath, depth + 1)}
        </div>
      );
    });
  };

  // Open the modal to add a new component either at root (if path empty)
  // or under the specified parent path.
  const openModal = (path: number[] = []) => {
    setParentPath(path);
    setForm({ name: '', quantity: '' });
    setModalOpen(true);
  };

  // Recursive helper to insert a new item into the BOM at the specified path.
  const addItemAtPath = (items: BomItem[], path: number[], newItem: BomItem): BomItem[] => {
    if (path.length === 0) {
      return [...items, newItem];
    }
    const [head, ...tail] = path;
    return items.map((item, index) => {
      if (index !== head) return item;
      const children = item.children ? [...item.children] : [];
      const updatedChildren = addItemAtPath(children, tail, newItem);
      return { ...item, children: updatedChildren };
    });
  };

  const handleAdd = () => {
    const { name, quantity } = form;
    if (!name) return;
    const newItem: BomItem = {
      name,
      quantity: quantity ? Number(quantity) : undefined,
    };
    setBom((prev) => addItemAtPath(prev, parentPath, newItem));
    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bill of Materials</h1>
        <Button onClick={() => openModal([])}>Add Root Component</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>BOM Tree</CardTitle>
        </CardHeader>
        <CardContent>
          {bom.length > 0 ? renderTree(bom) : (
            <p className="text-sm text-muted-foreground">No components yet.</p>
          )}
        </CardContent>
      </Card>
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Component</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="comp-name">Name</Label>
                <Input
                  id="comp-name"
                  name="name"
                  placeholder="Component name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="comp-qty">Quantity (optional)</Label>
                <Input
                  id="comp-qty"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!form.name}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Bom;