import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Period {
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

interface TimetableViewProps {
  schedule: DaySchedule[];
  currentDay?: string;
}

export default function TimetableView({ schedule, currentDay }: TimetableViewProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getCurrentDay = () => {
    if (currentDay) return currentDay;
    const dayIndex = new Date().getDay();
    return dayIndex === 0 ? 'Sunday' : days[dayIndex - 1];
  };

  const currentDayName = getCurrentDay();

  const renderPeriod = (period: Period, index: number) => {
    const colors = [
      'border-blue-500 bg-blue-50',
      'border-purple-500 bg-purple-50',
      'border-green-500 bg-green-50',
      'border-orange-500 bg-orange-50',
      'border-pink-500 bg-pink-50',
      'border-teal-500 bg-teal-50',
      'border-indigo-500 bg-indigo-50',
      'border-red-500 bg-red-50',
    ];

    const colorClass = colors[index % colors.length];

    return (
      <View
        key={index}
        className={`border-l-4 ${colorClass} rounded-lg p-3 mb-3`}
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {period.subject}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {period.teacher}
              </Text>
            </View>
          </View>
          <View className="bg-white rounded-lg px-2 py-1 border border-gray-200">
            <Text className="text-xs font-medium text-gray-700">
              {period.room}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {period.startTime} - {period.endTime}
          </Text>
        </View>
      </View>
    );
  };

  const renderDay = (daySchedule: DaySchedule) => {
    const isCurrentDay = daySchedule.day === currentDayName;

    return (
      <View key={daySchedule.day} className="mb-6">
        <View
          className={`flex-row items-center mb-3 pb-2 border-b-2 ${
            isCurrentDay ? 'border-blue-500' : 'border-gray-200'
          }`}
        >
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              isCurrentDay ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
          <Text
            className={`text-lg font-bold ${
              isCurrentDay ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {daySchedule.day}
          </Text>
          {isCurrentDay && (
            <View className="bg-blue-500 rounded-full px-2 py-1 ml-2">
              <Text className="text-xs text-white font-medium">Today</Text>
            </View>
          )}
        </View>

        {daySchedule.periods.length > 0 ? (
          daySchedule.periods.map((period, index) => renderPeriod(period, index))
        ) : (
          <View className="bg-gray-50 rounded-lg p-4 items-center">
            <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No classes scheduled</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-sm opacity-80 mb-1">
              Weekly Timetable
            </Text>
            <Text className="text-white text-xl font-bold">
              {currentDayName}
            </Text>
          </View>
          <View className="bg-white/20 rounded-full p-3">
            <Ionicons name="calendar" size={28} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Legend */}
      <View className="bg-white rounded-xl p-4 mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Quick Guide
        </Text>
        <View className="flex-row flex-wrap">
          <LegendItem icon="book-outline" label="Subject" color="#3B82F6" />
          <LegendItem icon="person-outline" label="Teacher" color="#8B5CF6" />
          <LegendItem icon="location-outline" label="Room" color="#10B981" />
          <LegendItem icon="time-outline" label="Timing" color="#F59E0B" />
        </View>
      </View>

      {/* Timetable */}
      {schedule.length > 0 ? (
        schedule.map((daySchedule) => renderDay(daySchedule))
      ) : (
        <View className="bg-white rounded-xl p-8 items-center">
          <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 text-center mt-4 text-base">
            No timetable available
          </Text>
          <Text className="text-gray-400 text-center mt-2 text-sm">
            Please check back later or contact administration
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function LegendItem({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center mr-4 mb-2">
      <Ionicons name={icon as any} size={16} color={color} />
      <Text className="text-xs text-gray-600 ml-1">{label}</Text>
    </View>
  );
}
