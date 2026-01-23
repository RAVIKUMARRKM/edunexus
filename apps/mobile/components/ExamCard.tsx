import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Exam {
  id: string;
  name: string;
  subject?: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'UPCOMING' | 'COMPLETED' | 'ONGOING' | 'PUBLISHED';
  venue?: string;
  grade?: string;
}

interface ExamCardProps {
  exam: Exam;
  onPress: () => void;
}

export default function ExamCard({ exam, onPress }: ExamCardProps) {
  const getStatusColor = () => {
    switch (exam.status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-700';
      case 'ONGOING':
        return 'bg-orange-100 text-orange-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (exam.status) {
      case 'UPCOMING':
        return 'calendar';
      case 'ONGOING':
        return 'timer';
      case 'COMPLETED':
        return 'checkmark-done';
      case 'PUBLISHED':
        return 'document-text';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getPercentage = () => {
    if (exam.obtainedMarks !== undefined && exam.totalMarks) {
      return ((exam.obtainedMarks / exam.totalMarks) * 100).toFixed(1);
    }
    return null;
  };

  const percentage = getPercentage();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {exam.name}
          </Text>
          {exam.subject && (
            <Text className="text-sm text-gray-500">{exam.subject}</Text>
          )}
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
          <View className="flex-row items-center">
            <Ionicons
              name={getStatusIcon()}
              size={14}
              color={
                exam.status === 'UPCOMING'
                  ? '#1D4ED8'
                  : exam.status === 'ONGOING'
                  ? '#EA580C'
                  : exam.status === 'PUBLISHED'
                  ? '#15803D'
                  : '#374151'
              }
            />
            <Text
              className={`ml-1 text-xs font-medium ${
                exam.status === 'UPCOMING'
                  ? 'text-blue-700'
                  : exam.status === 'ONGOING'
                  ? 'text-orange-700'
                  : exam.status === 'PUBLISHED'
                  ? 'text-green-700'
                  : 'text-gray-700'
              }`}
            >
              {exam.status}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-600 ml-2">
          {formatDate(exam.date)}
        </Text>
        <Ionicons name="time-outline" size={16} color="#6B7280" className="ml-4" />
        <Text className="text-sm text-gray-600 ml-2">
          {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
        </Text>
      </View>

      {exam.venue && (
        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">{exam.venue}</Text>
        </View>
      )}

      {exam.status === 'PUBLISHED' && exam.obtainedMarks !== undefined ? (
        <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mt-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-600 mb-1">Marks Obtained</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {exam.obtainedMarks}/{exam.totalMarks}
              </Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-white items-center justify-center border-4 border-blue-500">
                <Text className="text-lg font-bold text-blue-600">
                  {percentage}%
                </Text>
              </View>
              {exam.grade && (
                <Text className="text-sm font-semibold text-gray-700 mt-1">
                  Grade: {exam.grade}
                </Text>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View className="bg-gray-50 rounded-lg p-3 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">Total Marks</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {exam.totalMarks}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
