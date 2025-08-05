import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface NewBatchModalProps {
  open: boolean;
  onClose: () => void;
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

// Define the shape of a production lifecycle step. Each step includes a
// human‑readable name and a type indicating whether the work happens
// in‑house, at a vendor or a combination of both. The id property is
// used internally for list rendering.
interface Stage {
  id: string;
  name: string;
  type: 'in-house' | 'vendor' | 'both';
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({ open, onClose }) => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: '', quantity: 0, unit: 'meters' }
  ]);

  // Initialise the lifecycle with a set of typical manufacturing steps.
  // Users can modify, remove or extend this list to match the unique
  // requirements of their batch. The id values here are arbitrary and
  // strictly for React list keys.
  const [stages, setStages] = useState<Stage[]>([
    { id: 'stage-1', name: 'Design', type: 'in-house' },
    { id: 'stage-2', name: 'Sampling', type: 'in-house' },
    { id: 'stage-3', name: 'PO Approval', type: 'in-house' },
    { id: 'stage-4', name: 'Sourcing', type: 'vendor' },
    { id: 'stage-5', name: 'Cutting', type: 'in-house' },
    { id: 'stage-6', name: 'Stitching', type: 'both' },
    { id: 'stage-7', name: 'Finishing', type: 'in-house' },
    { id: 'stage-8', name: 'QA', type: 'in-house' },
    { id: 'stage-9', name: 'Packing', type: 'vendor' },
    { id: 'stage-10', name: 'Shipping', type: 'vendor' },
  ]);

  const addMaterial = () => {
    const newId = (materials.length + 1).toString();
    setMaterials([...materials, { id: newId, name: '', quantity: 0, unit: 'meters' }]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Lifecycle helpers
  const addStage = () => {
    const newIndex = stages.length + 1;
    setStages([...stages, { id: `stage-${newIndex}`, name: '', type: 'in-house' }]);
  };

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  const updateStage = (id: string, field: keyof Stage, value: any) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    // Log out the form values including materials and stages for demonstration.
    console.log('Form submitted', { stages, materials });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Batch</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <Input 
                id="batchId" 
                placeholder="e.g., B-2024-005"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemsCount">Items Count</Label>
              <Input 
                id="itemsCount" 
                type="number"
                placeholder="500"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input 
              id="productName" 
              placeholder="e.g., Cotton T-Shirts"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                type="date"
                required
              />
            </div>
            <div>
              <Label htmlFor="manager">Assigned Manager</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
                  <SelectItem value="mike-rodriguez">Mike Rodriguez</SelectItem>
                  <SelectItem value="emma-watson">Emma Watson</SelectItem>
                  <SelectItem value="james-liu">James Liu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description"
              placeholder="Additional details about this batch..."
              rows={3}
            />
          </div>

        {/* Production lifecycle section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Production Lifecycle</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStage}>
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <Card key={stage.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-2">
                      <Label className="text-xs">Step Name</Label>
                      <Select
                        value={stage.name}
                        onValueChange={(value) => updateStage(stage.id, 'name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select step" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Suggest common stages but allow selecting an empty value */}
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Sampling">Sampling</SelectItem>
                          <SelectItem value="PO Approval">PO Approval</SelectItem>
                          <SelectItem value="Sourcing">Sourcing</SelectItem>
                          <SelectItem value="Cutting">Cutting</SelectItem>
                          <SelectItem value="Stitching">Stitching</SelectItem>
                          <SelectItem value="Finishing">Finishing</SelectItem>
                          <SelectItem value="QA">QA</SelectItem>
                          <SelectItem value="Packing">Packing</SelectItem>
                          <SelectItem value="Shipping">Shipping</SelectItem>
                          <SelectItem value="Labeling">Labeling</SelectItem>
                          <SelectItem value="Ironing">Ironing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Execution Type</Label>
                      <Select
                        value={stage.type}
                        onValueChange={(value) => updateStage(stage.id, 'type', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-house">In-house</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {stages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStage(stage.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

          {/* Materials Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Materials Required</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                <Plus className="h-4 w-4 mr-1" />
                Add Material
              </Button>
            </div>

            <div className="space-y-3">
              {materials.map((material, index) => (
                <Card key={material.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div className="md:col-span-2">
                        <Label className="text-xs">Material Name</Label>
                        <Select 
                          value={material.name}
                          onValueChange={(value) => updateMaterial(material.id, 'name', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cotton-fabric">Cotton Fabric</SelectItem>
                            <SelectItem value="polyester-thread">Polyester Thread</SelectItem>
                            <SelectItem value="denim-fabric">Denim Fabric</SelectItem>
                            <SelectItem value="buttons">Buttons</SelectItem>
                            <SelectItem value="zippers">Zippers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={material.unit}
                          onValueChange={(value) => updateMaterial(material.id, 'unit', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meters">meters</SelectItem>
                            <SelectItem value="pieces">pieces</SelectItem>
                            <SelectItem value="rolls">rolls</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                          </SelectContent>
                        </Select>
                        {materials.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMaterial(material.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Batch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};