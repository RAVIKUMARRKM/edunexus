'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Allocation {
  id: string;
  pickupType: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNo: string;
    class?: { name: string };
    section?: { name: string };
  };
  route: {
    routeNo: string;
    name: string;
    vehicle: { vehicleNo: string };
  };
  stop: {
    name: string;
    fare: number;
  };
}

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [filteredAllocations, setFilteredAllocations] = useState<Allocation[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    studentId: '',
    routeId: '',
    stopId: '',
    pickupType: 'BOTH',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAllocations();
    fetchRoutes();
  }, []);

  useEffect(() => {
    const filtered = allocations.filter(
      (allocation) =>
        allocation.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.route.routeNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAllocations(filtered);
  }, [searchQuery, allocations]);

  useEffect(() => {
    if (formData.routeId) {
      fetchStops(formData.routeId);
    }
  }, [formData.routeId]);

  const fetchAllocations = async () => {
    try {
      const response = await fetch('/api/transport/allocations');
      const data = await response.json();
      if (data.success) {
        setAllocations(data.data);
        setFilteredAllocations(data.data);
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch allocations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/transport/routes');
      const data = await response.json();
      if (data.success) {
        setRoutes(data.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchStops = async (routeId: string) => {
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
      const response = await fetch('/api/transport/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Allocation created successfully',
        });
        setIsDialogOpen(false);
        fetchAllocations();
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create allocation',
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
      studentId: '',
      routeId: '',
      stopId: '',
      pickupType: 'BOTH',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '',
      isActive: true,
    });
    setStops([]);
  };

  const getPickupTypeBadge = (type: string) => {
    const variants: any = {
      BOTH: 'success',
      PICKUP_ONLY: 'info',
      DROP_ONLY: 'warning',
    };
    return <Badge variant={variants[type] || 'default'}>{type.replace('_', ' ')}</Badge>;
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
          <h1 className="text-3xl font-bold">Transport Allocations</h1>
          <p className="text-muted-foreground mt-1">
            Manage student transport assignments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Allocation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transport Allocation</DialogTitle>
              <DialogDescription>
                Assign a student to a transport route
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  required
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  placeholder="Enter student ID"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the student's database ID
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routeId">Route *</Label>
                <Select
                  value={formData.routeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, routeId: value, stopId: '' })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.routeNo} - {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {stops.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="stopId">Stop *</Label>
                  <Select
                    value={formData.stopId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, stopId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {stops.map((stop) => (
                        <SelectItem key={stop.id} value={stop.id}>
                          {stop.name} - ₹{stop.fare}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="pickupType">Pickup Type *</Label>
                <Select
                  value={formData.pickupType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pickupType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">Both Pickup & Drop</SelectItem>
                    <SelectItem value="PICKUP_ONLY">Pickup Only</SelectItem>
                    <SelectItem value="DROP_ONLY">Drop Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) =>
                      setFormData({ ...formData, validTo: e.target.value })
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
                <Button type="submit">Create Allocation</Button>
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
                placeholder="Search allocations..."
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
                <TableHead>Student</TableHead>
                <TableHead>Admission No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Stop</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Pickup Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No allocations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAllocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-medium">
                      {allocation.student.firstName} {allocation.student.lastName}
                    </TableCell>
                    <TableCell>{allocation.student.admissionNo}</TableCell>
                    <TableCell>
                      {allocation.student.class?.name || '-'}{' '}
                      {allocation.student.section?.name || ''}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {allocation.route.routeNo}
                        </div>
                        <div className="text-muted-foreground">
                          {allocation.route.vehicle.vehicleNo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{allocation.stop.name}</TableCell>
                    <TableCell>₹{allocation.stop.fare}</TableCell>
                    <TableCell>
                      {getPickupTypeBadge(allocation.pickupType)}
                    </TableCell>
                    <TableCell>
                      {allocation.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
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
