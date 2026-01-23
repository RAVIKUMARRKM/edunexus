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
import { useToast } from '@/components/ui/toaster';

interface Room {
  id: string;
  roomNo: string;
  floor: number;
  roomType: string;
  capacity: number;
  occupied: number;
  rentPerMonth: number;
  facilities?: string;
  status: string;
  building: {
    name: string;
    code: string;
    type: string;
  };
  allocations: any[];
}

interface Building {
  id: string;
  name: string;
  code: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    roomNo: '',
    buildingId: '',
    floor: '',
    roomType: 'DOUBLE',
    capacity: '',
    rentPerMonth: '',
    facilities: '',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
  }, []);

  useEffect(() => {
    const filtered = rooms.filter(
      (room) =>
        room.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/hostel/rooms');
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
        setFilteredRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/hostel/buildings');
      const data = await response.json();
      if (data.success) {
        setBuildings(data.data);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hostel/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Room created successfully',
        });
        setIsDialogOpen(false);
        fetchRooms();
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create room',
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
      roomNo: '',
      buildingId: '',
      floor: '',
      roomType: 'DOUBLE',
      capacity: '',
      rentPerMonth: '',
      facilities: '',
      status: 'AVAILABLE',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      AVAILABLE: 'success',
      FULL: 'destructive',
      MAINTENANCE: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
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
          <h1 className="text-3xl font-bold">Hostel Rooms</h1>
          <p className="text-muted-foreground mt-1">
            Manage room availability and details
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Enter the details of the new room
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNo">Room Number *</Label>
                  <Input
                    id="roomNo"
                    required
                    value={formData.roomNo}
                    onChange={(e) =>
                      setFormData({ ...formData, roomNo: e.target.value })
                    }
                    placeholder="e.g., 101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingId">Building *</Label>
                  <Select
                    value={formData.buildingId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, buildingId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name} ({building.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor *</Label>
                  <Input
                    id="floor"
                    type="number"
                    required
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({ ...formData, floor: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type *</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roomType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="DOUBLE">Double</SelectItem>
                      <SelectItem value="TRIPLE">Triple</SelectItem>
                      <SelectItem value="DORMITORY">Dormitory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentPerMonth">Rent per Month (₹) *</Label>
                  <Input
                    id="rentPerMonth"
                    type="number"
                    step="0.01"
                    required
                    value={formData.rentPerMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, rentPerMonth: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities</Label>
                <Input
                  id="facilities"
                  value={formData.facilities}
                  onChange={(e) =>
                    setFormData({ ...formData, facilities: e.target.value })
                  }
                  placeholder="e.g., AC, Attached Bath, WiFi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="FULL">Full</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Room</Button>
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
                placeholder="Search rooms..."
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
                <TableHead>Room No</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Rent/Month</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No rooms found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNo}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{room.building.name}</div>
                        <div className="text-muted-foreground">
                          {room.building.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Floor {room.floor}</TableCell>
                    <TableCell>{room.roomType}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      <Badge variant={room.occupied >= room.capacity ? 'destructive' : 'success'}>
                        {room.occupied} / {room.capacity}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{room.rentPerMonth}</TableCell>
                    <TableCell>{getStatusBadge(room.status)}</TableCell>
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
