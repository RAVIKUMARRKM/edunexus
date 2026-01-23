'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { ArrowLeft, Plus, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface RouteStop {
  id: string;
  name: string;
  pickupTime: string;
  dropTime: string;
  fare: number;
  sequence: number;
  latitude?: number;
  longitude?: number;
}

interface RouteDetails {
  id: string;
  name: string;
  routeNo: string;
  startPoint: string;
  endPoint: string;
  distance?: number;
  vehicle: {
    vehicleNo: string;
    vehicleType: string;
    capacity: number;
  };
  stops: RouteStop[];
  allocations: any[];
}

export default function RouteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const routeId = params.id as string;

  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    pickupTime: '',
    dropTime: '',
    fare: '',
    sequence: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    fetchRouteDetails();
    fetchStops();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    try {
      const response = await fetch('/api/transport/routes');
      const data = await response.json();
      if (data.success) {
        const foundRoute = data.data.find((r: any) => r.id === routeId);
        if (foundRoute) {
          setRoute(foundRoute);
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch route details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStops = async () => {
    try {
      const response = await fetch(`/api/transport/routes/${routeId}/stops`);
      const data = await response.json();
      if (data.success) {
        setStops(data.data);
      }
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/transport/routes/${routeId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Stop added successfully',
        });
        setIsDialogOpen(false);
        fetchStops();
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add stop',
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
      pickupTime: '',
      dropTime: '',
      fare: '',
      sequence: (stops.length + 1).toString(),
      latitude: '',
      longitude: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Route not found</p>
        <Button onClick={() => router.push('/transport/routes')}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/transport/routes')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{route.name}</h1>
          <p className="text-muted-foreground mt-1">Route {route.routeNo}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Route Stop</DialogTitle>
              <DialogDescription>
                Add a new stop to this route
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Stop Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Main Market"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Pickup Time *</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    required
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropTime">Drop Time *</Label>
                  <Input
                    id="dropTime"
                    type="time"
                    required
                    value={formData.dropTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dropTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fare">Fare (₹) *</Label>
                  <Input
                    id="fare"
                    type="number"
                    step="0.01"
                    required
                    value={formData.fare}
                    onChange={(e) =>
                      setFormData({ ...formData, fare: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sequence">Sequence *</Label>
                  <Input
                    id="sequence"
                    type="number"
                    required
                    value={formData.sequence}
                    onChange={(e) =>
                      setFormData({ ...formData, sequence: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Stop</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{route.vehicle.vehicleNo}</div>
            <p className="text-sm text-muted-foreground">
              {route.vehicle.vehicleType} - Capacity: {route.vehicle.capacity}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Route Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span className="font-medium">
                  {route.distance ? `${route.distance} km` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stops:</span>
                <span className="font-medium">{stops.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {route.allocations.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Active allocations
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Stops</CardTitle>
        </CardHeader>
        <CardContent>
          {stops.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stops added yet. Add your first stop to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Stop Name</TableHead>
                  <TableHead>Pickup Time</TableHead>
                  <TableHead>Drop Time</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stops.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell>
                      <Badge variant="outline">{stop.sequence}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{stop.name}</TableCell>
                    <TableCell>{stop.pickupTime}</TableCell>
                    <TableCell>{stop.dropTime}</TableCell>
                    <TableCell>₹{stop.fare}</TableCell>
                    <TableCell>
                      {stop.latitude && stop.longitude ? (
                        <Badge variant="success">
                          <MapPin className="h-3 w-3 mr-1" />
                          GPS
                        </Badge>
                      ) : (
                        <Badge variant="outline">No GPS</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
