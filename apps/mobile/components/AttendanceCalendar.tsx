import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HOLIDAY';
}

interface AttendanceCalendarProps {
  attendanceRecords: AttendanceRecord[];
  month: Date;
  onMonthChange: (date: Date) => void;
}

export default function AttendanceCalendar({
  attendanceRecords,
  month,
  onMonthChange,
}: AttendanceCalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceStatus = (day: number) => {
    const dateStr = new Date(
      month.getFullYear(),
      month.getMonth(),
      day
    ).toISOString().split('T')[0];

    return attendanceRecords.find((record) =>
      record.date.startsWith(dateStr)
    )?.status;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-500';
      case 'ABSENT':
        return 'bg-red-500';
      case 'LATE':
        return 'bg-yellow-500';
      case 'HOLIDAY':
        return 'bg-blue-500';
      default:
        return 'bg-gray-200';
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(month);
  const weeks = [];
  let days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }

  // Add remaining days to last week
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(null);
    }
    weeks.push(days);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View className="bg-white rounded-xl p-4">
      {/* Month Navigation */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} className="p-2">
          <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View className="flex-row mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs font-semibold text-gray-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row mb-1">
          {week.map((day, dayIndex) => {
            const status = day ? getAttendanceStatus(day) : undefined;
            const statusColor = getStatusColor(status);

            return (
              <View key={dayIndex} className="flex-1 items-center p-1">
                {day ? (
                  <View className={`w-10 h-10 rounded-full items-center justify-center ${statusColor}`}>
                    <Text className={`${status ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {day}
                    </Text>
                  </View>
                ) : (
                  <View className="w-10 h-10" />
                )}
              </View>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View className="flex-row flex-wrap mt-4 pt-4 border-t border-gray-200">
        <LegendItem color="bg-green-500" label="Present" />
        <LegendItem color="bg-red-500" label="Absent" />
        <LegendItem color="bg-yellow-500" label="Late" />
        <LegendItem color="bg-blue-500" label="Holiday" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center mr-4 mb-2">
      <View className={`w-4 h-4 rounded-full ${color} mr-2`} />
      <Text className="text-xs text-gray-600">{label}</Text>
    </View>
  );
}
