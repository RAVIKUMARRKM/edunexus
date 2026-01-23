'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, FileText } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  expectedDate?: string;
  totalAmount: string;
  status: string;
  vendor: {
    name: string;
    code: string;
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    receivedQty: number;
    item: {
      name: string;
      code: string;
      category: {
        name: string;
      };
    };
  }[];
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchPurchaseOrders();
  }, [filter]);

  const fetchPurchaseOrders = async () => {
    try {
      const url =
        filter === 'ALL'
          ? '/api/inventory/purchase-orders'
          : `/api/inventory/purchase-orders?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setPurchaseOrders(data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: {
      [key: string]: 'success' | 'warning' | 'destructive' | 'secondary' | 'default';
    } = {
      DRAFT: 'secondary',
      PENDING_APPROVAL: 'warning',
      APPROVED: 'default',
      ORDERED: 'default',
      RECEIVED: 'success',
      CANCELLED: 'destructive',
    };

    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500">Manage purchase orders and track deliveries</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      <div className="flex space-x-2">
        {['ALL', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'RECEIVED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({purchaseOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{po.vendor.name}</div>
                        <div className="text-sm text-gray-500">{po.vendor.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {po.expectedDate
                        ? new Date(po.expectedDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>{po.items.length} items</TableCell>
                    <TableCell className="font-semibold">
                      ₹{parseFloat(po.totalAmount).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(po.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPO(po)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedPO && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Purchase Order Details - {selectedPO.poNumber}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedPO(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Vendor</div>
                <div className="font-medium">{selectedPO.vendor.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div>{getStatusBadge(selectedPO.status)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Order Date</div>
                <div>{new Date(selectedPO.orderDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Expected Date</div>
                <div>
                  {selectedPO.expectedDate
                    ? new Date(selectedPO.expectedDate).toLocaleDateString()
                    : '-'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPO.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item.code}</TableCell>
                      <TableCell>{item.item.name}</TableCell>
                      <TableCell>{item.item.category.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{parseFloat(item.unitPrice).toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{parseFloat(item.totalPrice).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {item.receivedQty} / {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-2xl font-bold">
                    ₹{parseFloat(selectedPO.totalAmount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
