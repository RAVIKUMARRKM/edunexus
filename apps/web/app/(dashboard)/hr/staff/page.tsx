'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';

interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  basicSalary: string;
  status: string;
  joiningDate: string;
  department?: {
    name: string;
  };
  user: {
    email: string;
    phone?: string;
  };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = staff.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.designation.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staff);
    }
  }, [searchQuery, staff]);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/hr/staff');
      const data = await response.json();
      setStaff(data);
      setFilteredStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'destructive' | 'secondary' } = {
      ACTIVE: 'success',
      ON_LEAVE: 'warning',
      RESIGNED: 'destructive',
      TERMINATED: 'destructive',
    };

    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
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
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-gray-500">Manage all staff members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Staff ({filteredStaff.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search staff..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.employeeId}</TableCell>
                    <TableCell>
                      {staffMember.firstName} {staffMember.lastName}
                    </TableCell>
                    <TableCell>{staffMember.designation}</TableCell>
                    <TableCell>{staffMember.department?.name || '-'}</TableCell>
                    <TableCell>{staffMember.user.email}</TableCell>
                    <TableCell>{staffMember.user.phone || '-'}</TableCell>
                    <TableCell>₹{parseFloat(staffMember.basicSalary).toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(staffMember.joiningDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(staffMember.status)}</TableCell>
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
