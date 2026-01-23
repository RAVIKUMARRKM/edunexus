import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import ExamCard from '@/components/ExamCard';

export default function ExamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed'>('upcoming');

  const { data: examsData, isLoading, refetch } = useQuery({
    queryKey: ['exams', user?.id],
    queryFn: () => apiHelpers.getExams({ studentId: user?.id }),
  });

  const upcomingExams = examsData?.data?.exams?.filter(
    (exam: any) => exam.status === 'UPCOMING' || exam.status === 'ONGOING'
  ) || [];

  const completedExams = examsData?.data?.exams?.filter(
    (exam: any) => exam.status === 'COMPLETED' || exam.status === 'PUBLISHED'
  ) || [];

  const currentExams = selectedTab === 'upcoming' ? upcomingExams : completedExams;

  const handleExamPress = (examId: string) => {
    router.push(`/results/${examId}` as any);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Stats Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
        <Text className="text-white text-lg font-semibold mb-4">
          Exam Overview
        </Text>
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Upcoming</Text>
            <Text className="text-white text-2xl font-bold">
              {upcomingExams.length}
            </Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Completed</Text>
            <Text className="text-white text-2xl font-bold">
              {completedExams.length}
            </Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Average</Text>
            <Text className="text-white text-2xl font-bold">
              {examsData?.data?.averagePercentage || 0}%
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View className="bg-white px-4 pt-4 pb-2 shadow-sm">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'upcoming' ? 'bg-white' : ''
            }`}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === 'upcoming' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'completed' ? 'bg-white' : ''
            }`}
            onPress={() => setSelectedTab('completed')}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === 'completed' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exams List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="p-4">
          {isLoading ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-4">Loading exams...</Text>
            </View>
          ) : currentExams.length > 0 ? (
            currentExams.map((exam: any) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onPress={() => handleExamPress(exam.id)}
              />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons
                name={
                  selectedTab === 'upcoming'
                    ? 'calendar-outline'
                    : 'document-text-outline'
                }
                size={64}
                color="#D1D5DB"
              />
              <Text className="text-gray-500 text-center mt-4 text-base">
                {selectedTab === 'upcoming'
                  ? 'No upcoming exams'
                  : 'No completed exams'}
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                {selectedTab === 'upcoming'
                  ? 'You have no exams scheduled at the moment'
                  : 'You have not taken any exams yet'}
              </Text>
            </View>
          )}

          {/* Performance Summary (for completed exams) */}
          {selectedTab === 'completed' && completedExams.length > 0 && (
            <View className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Performance Summary
              </Text>
              <View className="space-y-3">
                <PerformanceItem
                  label="Total Exams"
                  value={completedExams.length.toString()}
                  icon="document-text"
                  color="#3B82F6"
                />
                <PerformanceItem
                  label="Average Percentage"
                  value={`${examsData?.data?.averagePercentage || 0}%`}
                  icon="trending-up"
                  color="#10B981"
                />
                <PerformanceItem
                  label="Highest Score"
                  value={`${examsData?.data?.highestScore || 0}%`}
                  icon="trophy"
                  color="#F59E0B"
                />
                <PerformanceItem
                  label="Lowest Score"
                  value={`${examsData?.data?.lowestScore || 0}%`}
                  icon="stats-chart"
                  color="#EF4444"
                />
              </View>
            </View>
          )}

          {/* Exam Tips (for upcoming exams) */}
          {selectedTab === 'upcoming' && upcomingExams.length > 0 && (
            <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                  <Ionicons name="bulb" size={18} color="#FFFFFF" />
                </View>
                <Text className="text-base font-semibold text-blue-900 ml-2">
                  Exam Preparation Tips
                </Text>
              </View>
              <View className="space-y-2">
                <TipItem text="Review your notes and study materials regularly" />
                <TipItem text="Practice with previous year questions" />
                <TipItem text="Get adequate sleep before the exam" />
                <TipItem text="Arrive at the exam venue 15 minutes early" />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function PerformanceItem({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text className="text-sm text-gray-600 ml-3">{label}</Text>
      </View>
      <Text className="text-base font-semibold text-gray-900">{value}</Text>
    </View>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-start">
      <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2" />
      <Text className="flex-1 text-sm text-blue-800">{text}</Text>
    </View>
  );
}
