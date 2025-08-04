import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatchDetailModal } from '@/components/batches/BatchDetailModal';

// A small mock dataset of batches to drive the map UI. In a real application
// this data would be fetched from the backend. Each batch has the fields
// required by the BatchDetailModal component.
const mockBatches = [
  {
    id: 'B-2024-001',
    currentPhase: 'sourcing' as const,
    startDate: '2024-01-15',
    estimatedEnd: '2024-02-01',
    manager: 'Sarah Chen',
    status: 'on-time' as const,
    itemsCount: 1000,
    product: 'Shirts',
  },
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
  {
    id: 'B-2024-003',
    currentPhase: 'qa' as const,
    startDate: '2024-01-20',
    estimatedEnd: '2024-02-05',
    manager: 'Emma Watson',
    status: 'on-time' as const,
    itemsCount: 600,
    product: 'Jackets',
  },
  {
    id: 'B-2024-004',
    currentPhase: 'dispatch' as const,
    startDate: '2024-01-22',
    estimatedEnd: '2024-02-10',
    manager: 'Mike Rodriguez',
    status: 'completed' as const,
    itemsCount: 400,
    product: 'Hats',
  },
];

// List of phases in the order they appear in the production pipeline. Each
// column in the map represents one of these phases. If your process has
// additional stages you can add them here and supply data accordingly.
const phases = ['sourcing', 'stitching', 'qa', 'dispatch'] as const;

/**
 * Displays a simple production map. Each column corresponds to a stage and
 * contains buttons for the batches currently in that phase. Clicking a
 * batch button opens a modal with detailed information. This page serves
 * as a high-level overview of the production pipeline and allows users to
 * quickly navigate to individual batches.
 */
const Map: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<typeof mockBatches[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBatchClick = (batch: typeof mockBatches[0]) => {
    setSelectedBatch(batch);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Production Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {phases.map((phase) => (
          <Card key={phase} className="flex flex-col">
            <CardHeader>
              <CardTitle className="capitalize text-lg">{phase}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              {mockBatches
                .filter((b) => b.currentPhase === phase)
                .map((batch) => (
                  <Button
                    key={batch.id}
                    variant="secondary"
                    className="w-full justify-between"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <span>{batch.id}</span>
                    <span className="text-xs capitalize">
                      {batch.status === 'on-time' && 'On Time'}
                      {batch.status === 'delayed' && 'Delayed'}
                      {batch.status === 'completed' && 'Completed'}
                    </span>
                  </Button>
                ))}
              {mockBatches.filter((b) => b.currentPhase === phase).length === 0 && (
                <p className="text-sm text-muted-foreground">No batches</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedBatch && (
        <BatchDetailModal
          batch={selectedBatch}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Map;