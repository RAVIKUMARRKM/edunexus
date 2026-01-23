'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { Progress } from '@/components/ui/progress';

interface Building {
  id: string;
  name: string;
  code: string;
  type: string;
  wardenName?: string;
  wardenPhone?: string;
  capacity: number;
  address?: string;
  stats: {
    totalRooms: number;
    totalCapacity: number;
    totalOccupied: number;
    availableRooms: number;
    occupancyRate: string;
  };
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'BOYS',
    wardenName: '',
    wardenPhone: '',
    capacity: '',
    address: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    const filtered = buildings.filter(
      (building) =>
        building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        building.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [searchQuery, buildings]);

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/hostel/buildings');
      const data = await response.json();
      if (data.success) {
        setBuildings(data.data);
        setFilteredBuildings(data.data);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch buildings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hostel/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Building created successfully',
        });
        setIsDialogOpen(false);
        fetchBuildings();
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create building',
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
      code: '',
      type: 'BOYS',
      wardenName: '',
      wardenPhone: '',
      capacity: '',
      address: '',
    });
  };

  const getTypeBadge = (type: string) => {
    const variants: any = {
      BOYS: 'info',
      GIRLS: 'success',
      STAFF: 'secondary',
    };
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
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
          <h1 className="text-3xl font-bold">Hostel Buildings</h1>
          <p className="text-muted-foreground mt-1">
            Manage hostel buildings and their details
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Building</DialogTitle>
              <DialogDescription>
                Enter the details of the new hostel building
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Building Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Block A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Building Code *</Label>
                  <Input
                    id="code"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., BLK-A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOYS">Boys</SelectItem>
                      <SelectItem value="GIRLS">Girls</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity *</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wardenName">Warden Name</Label>
                  <Input
                    id="wardenName"
                    value={formData.wardenName}
                    onChange={(e) =>
                      setFormData({ ...formData, wardenName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wardenPhone">Warden Phone</Label>
                  <Input
                    id="wardenPhone"
                    value={formData.wardenPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, wardenPhone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
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
                <Button type="submit">Create Building</Button>
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
                placeholder="Search buildings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBuildings.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No buildings found
            </CardContent>
          </Card>
        ) : (
          filteredBuildings.map((building) => (
            <Card key={building.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <CardTitle>{building.name}</CardTitle>
                  </div>
                  {getTypeBadge(building.type)}
                </div>
                <p className="text-sm text-muted-foreground">{building.code}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">
                      {building.stats.totalOccupied} / {building.stats.totalCapacity}
                    </span>
                  </div>
                  <Progress value={parseFloat(building.stats.occupancyRate)} />
                  <p className="text-xs text-muted-foreground text-right">
                    {building.stats.occupancyRate}% occupied
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Rooms</p>
                    <p className="font-medium">{building.stats.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-medium">{building.stats.availableRooms}</p>
                  </div>
                </div>
                {building.wardenName && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Warden</p>
                    <p className="text-sm font-medium">{building.wardenName}</p>
                    {building.wardenPhone && (
                      <p className="text-xs text-muted-foreground">
                        {building.wardenPhone}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
