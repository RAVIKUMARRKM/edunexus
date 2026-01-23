import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import AttendanceList from '@/components/AttendanceList';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Fetch classes for teachers
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => apiHelpers.getClasses(),
    enabled: isTeacher,
  });

  // Fetch students for marking attendance (teachers)
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['students', selectedClass, selectedSection],
    queryFn: () =>
      apiHelpers.getStudents({
        classId: selectedClass,
        sectionId: selectedSection,
      }),
    enabled: isTeacher && !!selectedClass && !!selectedSection,
  });

  // Fetch attendance records (students/parents view)
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance', selectedMonth],
    queryFn: () =>
      apiHelpers.getAttendance({
        classId: user?.classId || '',
        sectionId: user?.sectionId || '',
        date: selectedMonth.toISOString().split('T')[0],
      }),
    enabled: !isTeacher && !!user?.classId,
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.markAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      alert('Attendance marked successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to mark attendance');
    },
  });

  const handleMarkAttendance = (attendance: Record<string, string>) => {
    const attendanceRecords = Object.entries(attendance).map(
      ([studentId, status]) => ({
        studentId,
        status,
        date: selectedDate.toISOString().split('T')[0],
        classId: selectedClass,
        sectionId: selectedSection,
      })
    );

    markAttendanceMutation.mutate({
      date: selectedDate.toISOString().split('T')[0],
      records: attendanceRecords,
    });
  };

  if (isTeacher) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Date Selector */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Select Date
            </Text>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="bg-blue-100 rounded-lg p-3 flex-row items-center"
                onPress={() => setSelectedDate(new Date())}
              >
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                <Text className="ml-2 text-blue-600 font-medium">
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg px-4 py-3"
                onPress={() => setSelectedDate(new Date())}
              >
                <Text className="text-white font-medium">Today</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Class & Section Selector */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Select Class & Section
            </Text>
            <View className="flex-row space-x-2">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Class</Text>
                <TouchableOpacity className="bg-gray-100 rounded-lg p-3">
                  <Text className="text-gray-700">
                    {selectedClass || 'Select Class'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Section</Text>
                <TouchableOpacity className="bg-gray-100 rounded-lg p-3">
                  <Text className="text-gray-700">
                    {selectedSection || 'Select Section'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Students List */}
          {loadingStudents ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-4">Loading students...</Text>
            </View>
          ) : studentsData?.data?.students ? (
            <AttendanceList
              students={studentsData.data.students}
              onSubmit={handleMarkAttendance}
              loading={markAttendanceMutation.isPending}
            />
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="people-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4">
                Please select class and section to mark attendance
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  // Student/Parent View
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Stats Cards */}
        <View className="flex-row mb-4 space-x-3">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Present</Text>
                <Text className="text-2xl font-bold text-green-600">
                  {attendanceData?.data?.stats?.present || 0}
                </Text>
              </View>
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            </View>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Absent</Text>
                <Text className="text-2xl font-bold text-red-600">
                  {attendanceData?.data?.stats?.absent || 0}
                </Text>
              </View>
              <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>

        {/* Attendance Percentage */}
        <View className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 mb-4">
          <Text className="text-white text-sm opacity-80 mb-2">
            Overall Attendance
          </Text>
          <View className="flex-row items-end">
            <Text className="text-white text-4xl font-bold">
              {attendanceData?.data?.stats?.percentage || 0}
            </Text>
            <Text className="text-white text-2xl font-semibold ml-1 mb-1">%</Text>
          </View>
          <View className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <View
              className="h-full bg-white rounded-full"
              style={{
                width: `${attendanceData?.data?.stats?.percentage || 0}%`,
              }}
            />
          </View>
        </View>

        {/* Attendance Calendar */}
        {loadingAttendance ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-4">Loading attendance...</Text>
          </View>
        ) : (
          <AttendanceCalendar
            attendanceRecords={attendanceData?.data?.records || []}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}

        {/* Recent Attendance */}
        <View className="bg-white rounded-xl p-4 mt-4 shadow-sm">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Recent Attendance
          </Text>
          {attendanceData?.data?.recent?.length > 0 ? (
            attendanceData.data.recent.map((record: any, index: number) => (
              <View
                key={index}
                className={`flex-row items-center justify-between py-3 ${
                  index !== attendanceData.data.recent.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    record.status === 'PRESENT'
                      ? 'bg-green-100'
                      : record.status === 'ABSENT'
                      ? 'bg-red-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      record.status === 'PRESENT'
                        ? 'text-green-700'
                        : record.status === 'ABSENT'
                        ? 'text-red-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    {record.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">
              No attendance records
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
