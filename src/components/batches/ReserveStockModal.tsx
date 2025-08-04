import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReserveStockModalProps {
  material: { name: string; remaining: number };
  open: boolean;
  onClose: () => void;
  onReserve: (quantity: number) => void;
}

const ReserveStockModal: React.FC<ReserveStockModalProps> = ({ material, open, onClose, onReserve }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Reset quantity when modal opens.
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  const handleReserve = () => {
    const qty = isNaN(Number(quantity)) ? 0 : Number(quantity);
    onReserve(qty);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm">
              Reserve material: <span className="font-medium">{material?.name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Available: {material?.remaining}
            </p>
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              max={material?.remaining ?? 0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleReserve} disabled={quantity < 1 || quantity > (material?.remaining ?? 0)}>
              Reserve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveStockModal;