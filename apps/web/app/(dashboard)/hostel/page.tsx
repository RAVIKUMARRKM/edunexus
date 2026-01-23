'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Bed, Users, Home } from 'lucide-react';

interface DashboardStats {
  totalBuildings: number;
  totalRooms: number;
  totalCapacity: number;
  totalOccupied: number;
  occupancyRate: number;
}

export default function HostelDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBuildings: 0,
    totalRooms: 0,
    totalCapacity: 0,
    totalOccupied: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [buildingsRes, roomsRes, allocationsRes] = await Promise.all([
        fetch('/api/hostel/buildings'),
        fetch('/api/hostel/rooms'),
        fetch('/api/hostel/allocations?isActive=true'),
      ]);

      const buildingsData = await buildingsRes.json();
      const roomsData = await roomsRes.json();
      const allocationsData = await allocationsRes.json();

      if (buildingsData.success && roomsData.success && allocationsData.success) {
        const totalCapacity = roomsData.data.reduce(
          (sum: number, room: any) => sum + room.capacity,
          0
        );
        const totalOccupied = roomsData.data.reduce(
          (sum: number, room: any) => sum + room.occupied,
          0
        );

        setStats({
          totalBuildings: buildingsData.data.length,
          totalRooms: roomsData.data.length,
          totalCapacity,
          totalOccupied,
          occupancyRate:
            totalCapacity > 0
              ? Math.round((totalOccupied / totalCapacity) * 100)
              : 0,
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
      title: 'Total Buildings',
      value: stats.totalBuildings,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/hostel/buildings',
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/hostel/rooms',
    },
    {
      title: 'Occupied / Capacity',
      value: `${stats.totalOccupied} / ${stats.totalCapacity}`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/hostel/allocations',
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/hostel/rooms',
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
          <h1 className="text-3xl font-bold">Hostel Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage hostel buildings, rooms, and student accommodations
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
              <Building2 className="h-5 w-5" />
              Buildings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage hostel buildings and their details
            </p>
            <Link href="/hostel/buildings">
              <Button className="w-full">Manage Buildings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Rooms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              View and manage room availability and details
            </p>
            <Link href="/hostel/rooms">
              <Button className="w-full">Manage Rooms</Button>
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
              Assign students to hostel rooms and manage allocations
            </p>
            <Link href="/hostel/allocations">
              <Button className="w-full">Manage Allocations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
