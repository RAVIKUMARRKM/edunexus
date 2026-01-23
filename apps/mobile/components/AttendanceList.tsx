import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
}

interface AttendanceListProps {
  students: Student[];
  onSubmit: (attendance: Record<string, string>) => void;
  loading?: boolean;
}

export default function AttendanceList({
  students,
  onSubmit,
  loading = false,
}: AttendanceListProps) {
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = () => {
    onSubmit(attendance);
  };

  const getStatusCount = () => {
    const counts = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
    };

    Object.values(attendance).forEach((status) => {
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const counts = getStatusCount();
  const totalMarked = Object.keys(attendance).length;

  const renderStudent = ({ item }: { item: Student }) => {
    const status = attendance[item.id];

    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
        <View className="flex-row items-center mb-3">
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-blue-600 font-semibold text-lg">
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1 ml-3">
            <Text className="text-base font-semibold text-gray-900">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">
              Roll No: {item.rollNumber}
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              status === 'PRESENT'
                ? 'bg-green-500'
                : 'bg-gray-100'
            }`}
            onPress={() => handleStatusChange(item.id, 'PRESENT')}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={status === 'PRESENT' ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-medium ${
                  status === 'PRESENT' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Present
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              status === 'ABSENT'
                ? 'bg-red-500'
                : 'bg-gray-100'
            }`}
            onPress={() => handleStatusChange(item.id, 'ABSENT')}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="close-circle"
                size={20}
                color={status === 'ABSENT' ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-medium ${
                  status === 'ABSENT' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Absent
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              status === 'LATE'
                ? 'bg-yellow-500'
                : 'bg-gray-100'
            }`}
            onPress={() => handleStatusChange(item.id, 'LATE')}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="time"
                size={20}
                color={status === 'LATE' ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-medium ${
                  status === 'LATE' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Late
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Summary Card */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Attendance Summary
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-1">
              <Text className="text-lg font-bold text-green-600">
                {counts.PRESENT}
              </Text>
            </View>
            <Text className="text-xs text-gray-600">Present</Text>
          </View>
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-1">
              <Text className="text-lg font-bold text-red-600">
                {counts.ABSENT}
              </Text>
            </View>
            <Text className="text-xs text-gray-600">Absent</Text>
          </View>
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-yellow-100 items-center justify-center mb-1">
              <Text className="text-lg font-bold text-yellow-600">
                {counts.LATE}
              </Text>
            </View>
            <Text className="text-xs text-gray-600">Late</Text>
          </View>
          <View className="items-center">
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-1">
              <Text className="text-lg font-bold text-blue-600">
                {totalMarked}/{students.length}
              </Text>
            </View>
            <Text className="text-xs text-gray-600">Marked</Text>
          </View>
        </View>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
      />

      {/* Submit Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          className={`py-4 rounded-xl ${
            totalMarked === students.length && !loading
              ? 'bg-blue-500'
              : 'bg-gray-300'
          }`}
          onPress={handleSubmit}
          disabled={totalMarked !== students.length || loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? 'Submitting...' : 'Submit Attendance'}
          </Text>
        </TouchableOpacity>
        {totalMarked !== students.length && (
          <Text className="text-center text-sm text-gray-500 mt-2">
            Mark all students to submit
          </Text>
        )}
      </View>
    </View>
  );
}
