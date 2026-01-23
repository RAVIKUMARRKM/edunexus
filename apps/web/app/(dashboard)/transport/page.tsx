'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Route as RouteIcon, Users, MapPin } from 'lucide-react';

interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalRoutes: number;
  totalAllocations: number;
}

export default function TransportDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    totalRoutes: 0,
    totalAllocations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vehiclesRes, routesRes, allocationsRes] = await Promise.all([
        fetch('/api/transport/vehicles'),
        fetch('/api/transport/routes'),
        fetch('/api/transport/allocations?isActive=true'),
      ]);

      const vehiclesData = await vehiclesRes.json();
      const routesData = await routesRes.json();
      const allocationsData = await allocationsRes.json();

      if (vehiclesData.success && routesData.success && allocationsData.success) {
        setStats({
          totalVehicles: vehiclesData.data.length,
          activeVehicles: vehiclesData.data.filter(
            (v: any) => v.status === 'ACTIVE'
          ).length,
          totalRoutes: routesData.data.length,
          totalAllocations: allocationsData.data.length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/transport/vehicles',
    },
    {
      title: 'Active Vehicles',
      value: stats.activeVehicles,
      icon: Bus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/transport/vehicles',
    },
    {
      title: 'Total Routes',
      value: stats.totalRoutes,
      icon: RouteIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/transport/routes',
    },
    {
      title: 'Active Allocations',
      value: stats.totalAllocations,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/transport/allocations',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transport Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage vehicles, routes, and student transportation
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link href={stat.link}>
                <Button variant="link" className="p-0 h-auto mt-1">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage your fleet of buses, vans, and other transport vehicles
            </p>
            <Link href="/transport/vehicles">
              <Button className="w-full">Manage Vehicles</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="h-5 w-5" />
              Routes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Define routes and stops for student pickup and drop-off
            </p>
            <Link href="/transport/routes">
              <Button className="w-full">Manage Routes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Allocations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Assign students to routes and manage transport allocations
            </p>
            <Link href="/transport/allocations">
              <Button className="w-full">Manage Allocations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
