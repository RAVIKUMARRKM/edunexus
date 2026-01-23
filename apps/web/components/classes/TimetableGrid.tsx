'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface TimetableSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  teacher: {
    user: {
      name: string;
    };
  };
  roomNo?: string | null;
}

interface TimetableGridProps {
  slots: TimetableSlot[];
  onEdit?: (slot: TimetableSlot) => void;
  onDelete?: (slotId: string) => void;
  editable?: boolean;
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

const TIME_SLOTS = [
  { start: '08:00', end: '08:45' },
  { start: '08:45', end: '09:30' },
  { start: '09:30', end: '10:15' },
  { start: '10:15', end: '11:00' },
  { start: '11:00', end: '11:45' },
  { start: '11:45', end: '12:30' },
  { start: '12:30', end: '13:15' },
  { start: '13:15', end: '14:00' },
  { start: '14:00', end: '14:45' },
  { start: '14:45', end: '15:30' },
];

export function TimetableGrid({
  slots,
  onEdit,
  onDelete,
  editable = false,
}: TimetableGridProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday by default

  // Group slots by day and time
  const slotsByDay = slots.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<number, TimetableSlot[]>);

  // Get slots for selected day sorted by time
  const daySlots = (slotsByDay[selectedDay] || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS.map((day, index) => (
              <Button
                key={day}
                variant={selectedDay === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDay(index)}
                className="min-w-[100px]"
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Timetable for selected day */}
          <div className="space-y-3">
            {daySlots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No classes scheduled for {DAYS[selectedDay]}
              </div>
            ) : (
              daySlots.map((slot) => (
                <Card key={slot.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            {slot.startTime} - {slot.endTime}
                          </Badge>
                          {slot.roomNo && (
                            <Badge variant="outline">Room {slot.roomNo}</Badge>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {slot.subject.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {slot.subject.code}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Teacher:
                          </span>
                          <span className="font-medium">
                            {slot.teacher.user.name}
                          </span>
                        </div>
                      </div>
                      {editable && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(slot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete?.(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
