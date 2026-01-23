'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, AlertTriangle, Users } from 'lucide-react';

interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  totalCategories: number;
  totalVendors: number;
  totalValue: number;
}

export default function InventoryDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalCategories: 0,
    totalVendors: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [itemsRes, categoriesRes, vendorsRes] = await Promise.all([
        fetch('/api/inventory/items'),
        fetch('/api/inventory/categories'),
        fetch('/api/inventory/vendors'),
      ]);

      const items = await itemsRes.json();
      const categories = await categoriesRes.json();
      const vendors = await vendorsRes.json();

      const lowStock = items.filter((item: any) => item.quantity <= item.minQuantity);
      const totalValue = items.reduce(
        (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
        0
      );

      setStats({
        totalItems: items.length,
        lowStockItems: lowStock.length,
        totalCategories: categories.length,
        totalVendors: vendors.length,
        totalValue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      title: 'Active Vendors',
      value: stats.totalVendors,
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-gray-500">Manage items, vendors, and purchase orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ₹{stats.totalValue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500">Total value of all inventory items</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/inventory/items"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Manage Items</div>
              <div className="text-sm text-gray-500">View and manage inventory items</div>
            </a>
            <a
              href="/inventory/purchase-orders"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Purchase Orders</div>
              <div className="text-sm text-gray-500">Create and manage purchase orders</div>
            </a>
            <a
              href="/inventory/vendors"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-semibold">Vendors</div>
              <div className="text-sm text-gray-500">Manage vendor information</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockItems > 0 ? (
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.lowStockItems} items
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Need immediate attention for restocking
                </p>
                <a
                  href="/inventory/items?lowStock=true"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View low stock items
                </a>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                All items are adequately stocked
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
