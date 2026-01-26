import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import TimetableView from '@/components/TimetableView';
import { generateTimetablePDF } from '@/lib/pdf-export';

export default function TimetableScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: timetableData, isLoading } = useQuery({
    queryKey: ['timetable', user?.classId, user?.sectionId],
    queryFn: async () => {
      const response = await api.get('/timetable', {
        params: {
          classId: user?.classId,
          sectionId: user?.sectionId,
        },
      });
      return response.data;
    },
    enabled: !!user?.classId,
  });

  const handleDownloadTimetable = async () => {
    if (timetableData?.data?.schedule) {
      await generateTimetablePDF({
        class: { name: timetableData.data.class || user?.classId || '' },
        section: { name: timetableData.data.section || user?.sectionId || '' },
        schedule: timetableData.data.schedule.map((day: any) => ({
          day: day.day,
          periods: day.periods.map((period: any) => ({
            startTime: period.startTime,
            endTime: period.endTime,
            subject: { name: period.subject },
            teacher: {
              firstName: period.teacher?.split(' ')[0] || '',
              lastName: period.teacher?.split(' ').slice(1).join(' ') || '',
            },
          })),
        })),
      });
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Timetable</Text>
          <TouchableOpacity onPress={handleDownloadTimetable}>
            <Ionicons name="download-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {user?.classId && (
          <View className="flex-row items-center">
            <View className="bg-white/20 px-3 py-1 rounded-full mr-2">
              <Text className="text-white text-sm">
                Class {timetableData?.data?.class || user.classId}
              </Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-sm">
                Section {timetableData?.data?.section || user.sectionId}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 p-4">
        {isLoading ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-4">Loading timetable...</Text>
          </View>
        ) : timetableData?.data?.schedule ? (
          <TimetableView
            schedule={timetableData.data.schedule}
            currentDay={timetableData.data.currentDay}
          />
        ) : (
          <View className="bg-white rounded-xl p-8 items-center">
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-center mt-4 text-base">
              No timetable available
            </Text>
            <Text className="text-gray-400 text-center mt-2 text-sm">
              Your class timetable will appear here once it's published
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
