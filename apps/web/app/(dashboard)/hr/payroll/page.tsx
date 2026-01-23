'use client';

import { useEffect, useState } from 'react';
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
import { DollarSign, Download } from 'lucide-react';

interface Salary {
  id: string;
  month: string;
  basicSalary: string;
  hra: string;
  da: string;
  ta: string;
  otherAllowances: string;
  grossSalary: string;
  pf: string;
  tax: string;
  otherDeductions: string;
  totalDeductions: string;
  netSalary: string;
  status: string;
  paidAt?: string;
  staff: {
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string;
    department?: {
      name: string;
    };
    user: {
      email: string;
    };
  };
}

export default function PayrollPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}`;
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchSalaries();
    }
  }, [selectedMonth]);

  const fetchSalaries = async () => {
    try {
      const response = await fetch(
        `/api/hr/salary?month=${selectedMonth}-01T00:00:00.000Z`
      );
      const data = await response.json();
      setSalaries(data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSalaries = async () => {
    if (!selectedMonth) {
      alert('Please select a month');
      return;
    }

    if (!confirm(`Process salaries for ${selectedMonth}?`)) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/hr/salary/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: `${selectedMonth}-01T00:00:00.000Z`,
          paymentMode: 'NET_BANKING',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchSalaries();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to process salaries');
      }
    } catch (error) {
      console.error('Error processing salaries:', error);
      alert('Failed to process salaries');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'destructive' | 'secondary' } = {
      PENDING: 'warning',
      PROCESSED: 'success',
      PAID: 'success',
      HOLD: 'destructive',
    };

    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const calculateTotals = () => {
    return salaries.reduce(
      (acc, salary) => ({
        gross: acc.gross + parseFloat(salary.grossSalary),
        deductions: acc.deductions + parseFloat(salary.totalDeductions),
        net: acc.net + parseFloat(salary.netSalary),
      }),
      { gross: 0, deductions: 0, net: 0 }
    );
  };

  const totals = calculateTotals();

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
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-gray-500">Process and manage employee salaries</p>
        </div>
        <Button onClick={handleProcessSalaries} disabled={processing}>
          <DollarSign className="h-4 w-4 mr-2" />
          {processing ? 'Processing...' : 'Process Salaries'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Gross Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totals.gross.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totals.deductions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Net Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totals.net.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Salary Details</CardTitle>
            <div className="flex items-center space-x-2">
              <Label>Select Month:</Label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>HRA</TableHead>
                <TableHead>DA</TableHead>
                <TableHead>TA</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>PF</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-gray-500">
                    No salary records found for this month
                  </TableCell>
                </TableRow>
              ) : (
                salaries.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {salary.staff.firstName} {salary.staff.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {salary.staff.employeeId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{salary.staff.designation}</TableCell>
                    <TableCell>{salary.staff.department?.name || '-'}</TableCell>
                    <TableCell>₹{parseFloat(salary.basicSalary).toLocaleString()}</TableCell>
                    <TableCell>₹{parseFloat(salary.hra).toLocaleString()}</TableCell>
                    <TableCell>₹{parseFloat(salary.da).toLocaleString()}</TableCell>
                    <TableCell>₹{parseFloat(salary.ta).toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{parseFloat(salary.grossSalary).toLocaleString()}
                    </TableCell>
                    <TableCell>₹{parseFloat(salary.pf).toLocaleString()}</TableCell>
                    <TableCell>₹{parseFloat(salary.tax).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      ₹{parseFloat(salary.netSalary).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(salary.status)}</TableCell>
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
