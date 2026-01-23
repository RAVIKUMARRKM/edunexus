'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface Route {
  id: string;
  name: string;
  routeNo: string;
  startPoint: string;
  endPoint: string;
  distance?: number;
  vehicle: {
    vehicleNo: string;
    vehicleType: string;
  };
  stops: any[];
  allocations: any[];
}

interface Vehicle {
  id: string;
  vehicleNo: string;
  vehicleType: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    routeNo: '',
    vehicleId: '',
    startPoint: '',
    endPoint: '',
    distance: '',
  });

  useEffect(() => {
    fetchRoutes();
    fetchVehicles();
  }, []);

  useEffect(() => {
    const filtered = routes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.endPoint.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchQuery, routes]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/transport/routes');
      const data = await response.json();
      if (data.success) {
        setRoutes(data.data);
        setFilteredRoutes(data.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch routes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/transport/vehicles?status=ACTIVE');
      const data = await response.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transport/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Route created successfully',
        });
        setIsDialogOpen(false);
        fetchRoutes();
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create route',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      routeNo: '',
      vehicleId: '',
      startPoint: '',
      endPoint: '',
      distance: '',
    });
  };

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
          <h1 className="text-3xl font-bold">Routes</h1>
          <p className="text-muted-foreground mt-1">
            Manage transport routes and stops
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>
                Enter the details of the new route
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., City Center Route"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routeNo">Route Number *</Label>
                <Input
                  id="routeNo"
                  required
                  value={formData.routeNo}
                  onChange={(e) =>
                    setFormData({ ...formData, routeNo: e.target.value })
                  }
                  placeholder="e.g., R-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, vehicleId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicleNo} - {vehicle.vehicleType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startPoint">Start Point *</Label>
                <Input
                  id="startPoint"
                  required
                  value={formData.startPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, startPoint: e.target.value })
                  }
                  placeholder="e.g., School Gate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endPoint">End Point *</Label>
                <Input
                  id="endPoint"
                  required
                  value={formData.endPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, endPoint: e.target.value })
                  }
                  placeholder="e.g., Central Bus Stand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                  }
                  placeholder="e.g., 15.5"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Route</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Start - End</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Stops</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No routes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">
                      {route.routeNo}
                    </TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {route.vehicle.vehicleNo}
                        </div>
                        <div className="text-muted-foreground">
                          {route.vehicle.vehicleType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{route.startPoint}</div>
                        <div className="text-muted-foreground">
                          to {route.endPoint}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {route.distance ? `${route.distance} km` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{route.stops.length} stops</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {route.allocations.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/transport/routes/${route.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
