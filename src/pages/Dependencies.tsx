import React from 'react';
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
import { ArrowRight } from 'lucide-react';

// Mock dependencies between batches. Each entry shows a dependency from one
// batch to another, representing that the second cannot start until the
// first is complete.
const mockDependencies = [
  { from: 'B-2024-001', to: 'B-2024-002' },
  { from: 'B-2024-002', to: 'B-2024-003' },
];

/**
 * Dependencies page displays directed relationships between batches. A
 * simple table conveys prerequisite links. A more advanced implementation
 * could use a DAG visualization or network graph.
 */
const DependenciesPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inter-Batch Dependencies</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dependency Graph</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">From</TableHead>
                <TableHead className="w-24"></TableHead>
                <TableHead className="w-40">To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDependencies.map((dep, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50">
                  <TableCell>{dep.from}</TableCell>
                  <TableCell className="text-center">
                    <ArrowRight className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>{dep.to}</TableCell>
                </TableRow>
              ))}
              {mockDependencies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No dependencies defined.
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

export default DependenciesPage;