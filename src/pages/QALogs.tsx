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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// Initial QA logs with pass/fail results and comments. Each log refers to
// a batch ID and includes the inspector name and timestamp.
const initialLogs = [
  {
    id: 'QA-001',
    batchId: 'B-2024-001',
    timestamp: '2024-01-20 16:00',
    inspector: 'James Liu',
    result: 'pass',
    comments: 'All items meet quality standards',
  },
  {
    id: 'QA-002',
    batchId: 'B-2024-002',
    timestamp: '2024-01-22 10:30',
    inspector: 'Anna Smith',
    result: 'fail',
    comments: 'Stitching issues found on 5 units',
  },
];

/**
 * QA Logs page provides a list of all quality inspections. Users can filter
 * by result to quickly identify failed inspections. The result is displayed
 * with a badge to aid visual scanning.
 */
const QALogs: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filtered = initialLogs.filter((log) => filter === 'all' || log.result === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">QA Logs</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inspection Results</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead className="w-32">Batch</TableHead>
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead className="w-32">Inspector</TableHead>
                <TableHead className="w-24">Result</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.batchId}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.inspector}</TableCell>
                  <TableCell>
                    <Badge variant={log.result === 'pass' ? 'default' : 'destructive'}>
                      {log.result.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.comments}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No QA logs found.
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

export default QALogs;