'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FeeStructureForm } from '@/components/fees/FeeStructureForm';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  feeType: string;
  amount: number;
  frequency: string;
  dueDay: number;
  lateFee: number;
  isOptional: boolean;
  academicYear: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  } | null;
}

export default function FeeStructuresPage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchFeeStructures();
    fetchAcademicYears();
    fetchClasses();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const response = await fetch('/api/fees/structures');
      if (!response.ok) throw new Error('Failed to fetch fee structures');
      const data = await response.json();
      setFeeStructures(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch fee structures');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      // This endpoint should be created in the academic module
      const response = await fetch('/api/academic/years');
      if (response.ok) {
        const data = await response.json();
        setAcademicYears(data);
      }
    } catch (error) {
      // If endpoint doesn't exist, use dummy data
      setAcademicYears([
        { id: '1', name: '2024-2025' },
        { id: '2', name: '2023-2024' },
      ]);
    }
  };

  const fetchClasses = async () => {
    try {
      // This endpoint should be created in the class module
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      // If endpoint doesn't exist, use dummy data
      setClasses([
        { id: '1', name: 'Class 1' },
        { id: '2', name: 'Class 2' },
        { id: '3', name: 'Class 3' },
      ]);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      ONE_TIME: 'One Time',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly',
      HALF_YEARLY: 'Half Yearly',
      YEARLY: 'Yearly',
    };
    return labels[frequency] || frequency;
  };

  const getFeeTypeColor = (feeType: string) => {
    const colors: Record<string, string> = {
      TUITION: 'bg-blue-100 text-blue-800',
      ADMISSION: 'bg-green-100 text-green-800',
      TRANSPORT: 'bg-yellow-100 text-yellow-800',
      HOSTEL: 'bg-purple-100 text-purple-800',
      LIBRARY: 'bg-pink-100 text-pink-800',
      LABORATORY: 'bg-indigo-100 text-indigo-800',
      SPORTS: 'bg-orange-100 text-orange-800',
      EXAM: 'bg-red-100 text-red-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[feeType] || colors.OTHER;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Structures</h1>
          <p className="text-gray-500 mt-1">
            Manage fee structures for different classes and fee types
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Fee Structure
        </Button>
      </div>

      {/* Fee Structures List */}
      <Card>
        <CardHeader>
          <CardTitle>All Fee Structures</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : feeStructures.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No fee structures found. Create your first fee structure.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Due Day</TableHead>
                  <TableHead>Late Fee</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeStructures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium">
                      {structure.name}
                      {structure.isOptional && (
                        <Badge variant="outline" className="ml-2">
                          Optional
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getFeeTypeColor(structure.feeType)}>
                        {structure.feeType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {structure.class?.name || 'All Classes'}
                    </TableCell>
                    <TableCell>₹{structure.amount.toFixed(2)}</TableCell>
                    <TableCell>{getFrequencyLabel(structure.frequency)}</TableCell>
                    <TableCell>{structure.dueDay}</TableCell>
                    <TableCell>₹{structure.lateFee.toFixed(2)}</TableCell>
                    <TableCell>{structure.academicYear.name}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Fee Structure</DialogTitle>
          </DialogHeader>
          <FeeStructureForm
            academicYears={academicYears}
            classes={classes}
            onSuccess={() => {
              setIsDialogOpen(false);
              fetchFeeStructures();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
