'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TimetableGrid } from '@/components/classes/TimetableGrid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

async function fetchClass(id: string) {
  const response = await fetch(`/api/classes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch class');
  return response.json();
}

async function fetchTimetable(classId: string, sectionId: string) {
  const response = await fetch(
    `/api/classes/${classId}/timetable?sectionId=${sectionId}`
  );
  if (!response.ok) throw new Error('Failed to fetch timetable');
  return response.json();
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TimetablePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    subjectId: '',
    teacherId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '09:45',
    roomNo: '',
  });

  const { data: classData, isLoading: loadingClass } = useQuery({
    queryKey: ['class', params.id],
    queryFn: () => fetchClass(params.id),
  });

  useEffect(() => {
    if (searchParams.get('section')) {
      setSelectedSection(searchParams.get('section') || '');
    } else if (classData?.sections?.[0]?.id) {
      setSelectedSection(classData.sections[0].id);
    }
  }, [searchParams, classData]);

  const { data: timetable, isLoading: loadingTimetable } = useQuery({
    queryKey: ['timetable', params.id, selectedSection],
    queryFn: () => fetchTimetable(params.id, selectedSection),
    enabled: !!selectedSection,
  });

  const addSlotMutation = useMutation({
    mutationFn: async (slot: any) => {
      const response = await fetch(`/api/classes/${params.id}/timetable`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: selectedSection,
          slots: [...(timetable || []), slot],
        }),
      });
      if (!response.ok) throw new Error('Failed to add slot');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetable', params.id, selectedSection],
      });
      toast.success('Timetable slot added successfully');
      setIsAddSlotOpen(false);
      setNewSlot({
        subjectId: '',
        teacherId: '',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '09:45',
        roomNo: '',
      });
    },
    onError: () => {
      toast.error('Failed to add timetable slot');
    },
  });

  const handleAddSlot = () => {
    if (!newSlot.subjectId || !newSlot.teacherId) {
      toast.error('Please select subject and teacher');
      return;
    }
    addSlotMutation.mutate(newSlot);
  };

  if (loadingClass) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Class not found</h2>
          <Link href="/classes">
            <Button className="mt-4">Back to Classes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-6">
        <Link href={`/classes/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Timetable - {classData.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {classData.academicYear.name}
              </p>
            </div>
            <Button onClick={() => setIsAddSlotOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Selector */}
          <div className="space-y-2">
            <Label>Select Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Choose a section" />
              </SelectTrigger>
              <SelectContent>
                {classData.sections.map((section: any) => (
                  <SelectItem key={section.id} value={section.id}>
                    Section {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timetable Display */}
          {!selectedSection ? (
            <div className="text-center py-12 text-muted-foreground">
              Please select a section to view timetable
            </div>
          ) : loadingTimetable ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <TimetableGrid slots={timetable || []} editable={true} />
          )}
        </CardContent>
      </Card>

      {/* Add Slot Dialog */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Timetable Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={newSlot.subjectId}
                onValueChange={(value) =>
                  setNewSlot({ ...newSlot, subjectId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {classData.subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select
                value={newSlot.teacherId}
                onValueChange={(value) =>
                  setNewSlot({ ...newSlot, teacherId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {classData.subjects
                    .find((s: any) => s.id === newSlot.subjectId)
                    ?.assignments.map((assignment: any) => (
                      <SelectItem
                        key={assignment.teacher.id}
                        value={assignment.teacher.id}
                      >
                        {assignment.teacher.user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select
                value={newSlot.dayOfWeek.toString()}
                onValueChange={(value) =>
                  setNewSlot({ ...newSlot, dayOfWeek: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Room Number (Optional)</Label>
              <Input
                value={newSlot.roomNo}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, roomNo: e.target.value })
                }
                placeholder="e.g., 101"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddSlotOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSlot} disabled={addSlotMutation.isPending}>
                {addSlotMutation.isPending ? 'Adding...' : 'Add Slot'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
