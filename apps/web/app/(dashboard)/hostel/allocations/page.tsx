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
  bedNo?: string;
  joinDate: string;
  leaveDate?: string;
  isActive: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNo: string;
    class?: { name: string };
    section?: { name: string };
  };
  room: {
    roomNo: string;
    floor: number;
    roomType: string;
    rentPerMonth: number;
    building: {
      name: string;
      code: string;
      type: string;
    };
  };
}

interface Room {
  id: string;
  roomNo: string;
  capacity: number;
  occupied: number;
  building: {
    name: string;
  };
}

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [filteredAllocations, setFilteredAllocations] = useState<Allocation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    studentId: '',
    roomId: '',
    bedNo: '',
    joinDate: new Date().toISOString().split('T')[0],
    leaveDate: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAllocations();
    fetchRooms();
  }, []);

  useEffect(() => {
    const filtered = allocations.filter(
      (allocation) =>
        allocation.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        allocation.room.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAllocations(filtered);
  }, [searchQuery, allocations]);

  const fetchAllocations = async () => {
    try {
      const response = await fetch('/api/hostel/allocations');
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

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/hostel/rooms?status=AVAILABLE');
      const data = await response.json();
      if (data.success) {
        // Filter rooms that have available capacity
        const availableRooms = data.data.filter(
          (room: Room) => room.occupied < room.capacity
        );
        setRooms(availableRooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hostel/allocations', {
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
        fetchRooms();
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
      roomId: '',
      bedNo: '',
      joinDate: new Date().toISOString().split('T')[0],
      leaveDate: '',
      isActive: true,
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
          <h1 className="text-3xl font-bold">Hostel Allocations</h1>
          <p className="text-muted-foreground mt-1">
            Manage room assignments for students
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
              <DialogTitle>Add Hostel Allocation</DialogTitle>
              <DialogDescription>
                Assign a student to a hostel room
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
                <Label htmlFor="roomId">Room *</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, roomId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No available rooms
                      </div>
                    ) : (
                      rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.building.name} - Room {room.roomNo} (
                          {room.capacity - room.occupied} available)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedNo">Bed Number</Label>
                <Input
                  id="bedNo"
                  value={formData.bedNo}
                  onChange={(e) =>
                    setFormData({ ...formData, bedNo: e.target.value })
                  }
                  placeholder="e.g., B1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaveDate">Leave Date</Label>
                  <Input
                    id="leaveDate"
                    type="date"
                    value={formData.leaveDate}
                    onChange={(e) =>
                      setFormData({ ...formData, leaveDate: e.target.value })
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
                <TableHead>Building</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Bed</TableHead>
                <TableHead>Rent/Month</TableHead>
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
                          {allocation.room.building.name}
                        </div>
                        <div className="text-muted-foreground">
                          {allocation.room.building.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          Room {allocation.room.roomNo}
                        </div>
                        <div className="text-muted-foreground">
                          Floor {allocation.room.floor} - {allocation.room.roomType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{allocation.bedNo || '-'}</TableCell>
                    <TableCell>₹{allocation.room.rentPerMonth}</TableCell>
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
