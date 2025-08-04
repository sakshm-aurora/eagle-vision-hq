import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Mock customer orders keyed by customer ID. Each order contains an
// identifier, a product description and progress percentage. In a real
// scenario this would come from an API based on the route parameter.
const customerOrders: Record<string, { id: string; product: string; progress: number }[]> = {
  '1': [
    { id: 'O-001', product: 'Shirts', progress: 75 },
    { id: 'O-002', product: 'Jackets', progress: 40 },
  ],
  '2': [
    { id: 'O-003', product: 'Pants', progress: 90 },
  ],
};

/**
 * CustomerPortal is a simple, read-only dashboard showing the status of a
 * customer's orders. It leverages route parameters to select which
 * customer's data to display. A more robust implementation would include
 * authentication and a richer set of KPIs.
 */
const CustomerPortal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = id && customerOrders[id] ? customerOrders[id] : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customer Portal</h1>
      <p className="text-muted-foreground">Viewing status for customer ID: {id}</p>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found for this customer.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="max-w-xl">
            <CardHeader>
              <CardTitle>Order {order.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">Product: {order.product}</div>
              <div>
                <Progress value={order.progress} className="h-3" />
                <div className="text-xs text-muted-foreground mt-1">
                  {order.progress}% complete
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CustomerPortal;