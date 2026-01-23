'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface SubjectAssignmentProps {
  teacherId: string;
}

export function SubjectAssignment({ teacherId }: SubjectAssignmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const queryClient = useQueryClient();

  // Fetch teacher's subject assignments
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['teacher-subjects', teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teachers/${teacherId}/subjects`);
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return res.json();
    },
  });

  // Fetch all available subjects
  const { data: allSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await fetch('/api/subjects');
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return res.json();
    },
    enabled: isOpen,
  });

  // Assign subject mutation
  const assignMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const res = await fetch(`/api/teachers/${teacherId}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to assign subject');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-subjects', teacherId] });
      toast.success('Subject assigned successfully');
      setIsOpen(false);
      setSelectedSubject('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Remove subject mutation
  const removeMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const res = await fetch(
        `/api/teachers/${teacherId}/subjects?subjectId=${subjectId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to remove subject');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-subjects', teacherId] });
      toast.success('Subject removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAssign = () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }
    assignMutation.mutate(selectedSubject);
  };

  const handleRemove = (subjectId: string) => {
    if (confirm('Are you sure you want to remove this subject assignment?')) {
      removeMutation.mutate(subjectId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subject Assignments</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Assign Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Subject</DialogTitle>
                <DialogDescription>
                  Select a subject to assign to this teacher.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a subject</option>
                    {allSubjects?.subjects?.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} - {subject.class?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAssign}
                  disabled={assignMutation.isPending}
                >
                  {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading subjects...
          </div>
        ) : assignments?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No subjects assigned yet.
          </div>
        ) : (
          <div className="space-y-3">
            {assignments?.map((assignment: any) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{assignment.subject.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Class: {assignment.subject.class.name} | Code: {assignment.subject.code}
                  </div>
                  {assignment.subject.isOptional && (
                    <Badge variant="outline" className="mt-1">
                      Optional
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(assignment.subject.id)}
                  disabled={removeMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
