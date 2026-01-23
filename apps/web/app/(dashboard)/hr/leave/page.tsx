'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Calendar } from 'lucide-react';

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  createdAt: string;
  teacher?: {
    firstName: string;
    lastName: string;
    department?: {
      name: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
  staff?: {
    firstName: string;
    lastName: string;
    department?: {
      name: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      const url =
        filter === 'ALL' ? '/api/hr/leave' : `/api/hr/leave?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/hr/leave/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchLeaves();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update leave request');
      }
    } catch (error) {
      console.error('Error updating leave:', error);
      alert('Failed to update leave request');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'destructive' | 'secondary' } = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'destructive',
      CANCELLED: 'secondary',
    };

    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      CASUAL: 'bg-blue-100 text-blue-800',
      SICK: 'bg-red-100 text-red-800',
      EARNED: 'bg-green-100 text-green-800',
      MATERNITY: 'bg-purple-100 text-purple-800',
      PATERNITY: 'bg-indigo-100 text-indigo-800',
      UNPAID: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type] || colors.CASUAL}`}>
        {type}
      </span>
    );
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
      <div>
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <p className="text-gray-500">Manage employee leave requests</p>
      </div>

      <div className="flex space-x-2">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status as any)}
          >
            {status}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests ({leaves.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
                {filter === 'PENDING' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No leave requests found
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => {
                  const employee = leave.teacher || leave.staff;
                  return (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {employee?.firstName} {employee?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{employee?.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee?.department?.name || '-'}</TableCell>
                      <TableCell>{getLeaveTypeBadge(leave.leaveType)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(leave.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            to {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {leave.days}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell>
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </TableCell>
                      {filter === 'PENDING' && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveReject(leave.id, 'APPROVED')}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveReject(leave.id, 'REJECTED')}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
