import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, TrendingDown, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unit: string;
  category: 'raw-material' | 'finished-good';
  location: string;
  supplier?: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Cotton Fabric',
    sku: 'CTN-001',
    currentStock: 150,
    reorderPoint: 200,
    maxStock: 1000,
    unit: 'meters',
    category: 'raw-material',
    location: 'Warehouse A-1',
    supplier: 'Cotton Corp',
  },
  {
    id: '2',
    name: 'Polyester Thread',
    sku: 'THR-002',
    currentStock: 50,
    reorderPoint: 100,
    maxStock: 500,
    unit: 'rolls',
    category: 'raw-material',
    location: 'Warehouse A-2',
    supplier: 'Thread Co',
  },
  {
    id: '3',
    name: 'Cotton T-Shirts',
    sku: 'TSH-001',
    currentStock: 250,
    reorderPoint: 50,
    maxStock: 1000,
    unit: 'pieces',
    category: 'finished-good',
    location: 'Warehouse B-1',
  },
  {
    id: '4',
    name: 'Denim Fabric',
    sku: 'DNM-001',
    currentStock: 75,
    reorderPoint: 150,
    maxStock: 800,
    unit: 'meters',
    category: 'raw-material',
    location: 'Warehouse A-3',
    supplier: 'Denim Plus',
  },
];

const Inventory = () => {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const rawMaterials = mockInventory.filter(item => item.category === 'raw-material');
  const finishedGoods = mockInventory.filter(item => item.category === 'finished-good');

  const filteredRawMaterials = showLowStockOnly 
    ? rawMaterials.filter(item => item.currentStock <= item.reorderPoint)
    : rawMaterials;

  const filteredFinishedGoods = showLowStockOnly 
    ? finishedGoods.filter(item => item.currentStock <= item.reorderPoint)
    : finishedGoods;

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.reorderPoint) return 'critical';
    if (percentage < 30) return 'low';
    if (percentage < 70) return 'medium';
    return 'good';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'low': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'good': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const status = getStockStatus(item);
    const percentage = (item.currentStock / item.maxStock) * 100;
    
    return (
      <Card className={cn("hover:shadow-md transition-shadow", 
        status === 'critical' && "border-destructive"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            {status === 'critical' && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{item.sku}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Stock:</span>
              <span className={cn("font-medium", getStockColor(status))}>
                {item.currentStock} {item.unit}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Reorder: {item.reorderPoint}</span>
              <span>Max: {item.maxStock}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Location: {item.location}
            </div>
            {status === 'critical' && item.supplier && (
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => { setSelectedItem(item); setShowPOModal(true); }}
              >
                Generate PO
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Track stock levels and manage materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showLowStockOnly ? "default" : "outline"}
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Low Stock Only
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Materials */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Raw Materials</h2>
            <Badge variant="secondary">
              {filteredRawMaterials.length} items
            </Badge>
          </div>
          <div className="grid gap-4">
            {filteredRawMaterials.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Finished Goods */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Finished Goods</h2>
            <Badge variant="secondary">
              {filteredFinishedGoods.length} items
            </Badge>
          </div>
          <div className="grid gap-4">
            {filteredFinishedGoods.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Material Requirement Planning */}
      <Card>
        <CardHeader>
          <CardTitle>Material Requirement Planning (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Projected Usage</TableHead>
                <TableHead>Expected Stock</TableHead>
                <TableHead>Action Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Cotton Fabric</TableCell>
                <TableCell>150 meters</TableCell>
                <TableCell>200 meters</TableCell>
                <TableCell className="text-destructive">-50 meters</TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive">Generate PO</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Polyester Thread</TableCell>
                <TableCell>50 rolls</TableCell>
                <TableCell>80 rolls</TableCell>
                <TableCell className="text-destructive">-30 rolls</TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive">Generate PO</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Denim Fabric</TableCell>
                <TableCell>75 meters</TableCell>
                <TableCell>60 meters</TableCell>
                <TableCell className="text-success">15 meters</TableCell>
                <TableCell>
                  <Badge variant="outline">No action needed</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Purchase Order Modal */}
      <Dialog open={showPOModal} onOpenChange={setShowPOModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <>
                <div>
                  <Label>Item</Label>
                  <Input value={selectedItem.name} disabled />
                </div>
                <div>
                  <Label>Supplier</Label>
                  <Select defaultValue={selectedItem.supplier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={selectedItem.supplier || ''}>{selectedItem.supplier}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    defaultValue={selectedItem.maxStock - selectedItem.currentStock}
                  />
                </div>
                <div>
                  <Label>Expected Delivery</Label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPOModal(false)}>
                    Cancel
                  </Button>
                  <Button>Generate PO</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;