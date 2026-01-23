import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import ResultCard from '@/components/ResultCard';

export default function ResultDetailScreen() {
  const router = useRouter();
  const { examId } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: resultData, isLoading } = useQuery({
    queryKey: ['exam-results', examId, user?.id],
    queryFn: () => apiHelpers.getExamResults(examId as string, user?.id),
    enabled: !!examId,
  });

  const result = resultData?.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600';
    if (grade === 'D') return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding Performance!';
    if (percentage >= 75) return 'Excellent Work!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 45) return 'Keep Improving!';
    return 'Need More Effort!';
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-4">Loading results...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold ml-4">Results</Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 text-center mt-4 text-base">
            Results not available
          </Text>
          <Text className="text-gray-400 text-center mt-2 text-sm">
            Results for this exam have not been published yet
          </Text>
        </View>
      </View>
    );
  }

  const totalMarks = result.subjects?.reduce(
    (sum: number, subject: any) => sum + subject.totalMarks,
    0
  ) || 0;

  const obtainedMarks = result.subjects?.reduce(
    (sum: number, subject: any) => sum + subject.obtainedMarks,
    0
  ) || 0;

  const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-white text-xl font-bold">{result.examName}</Text>
            <Text className="text-white text-sm opacity-80">
              {formatDate(result.examDate)}
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 rounded-full p-2">
            <Ionicons name="share-social" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Overall Performance Card */}
          <View className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-4 shadow-lg">
            <View className="items-center">
              <Text className="text-white text-sm opacity-80 mb-2">
                Overall Performance
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-5xl font-bold">{percentage}</Text>
                <Text className="text-white text-3xl font-semibold ml-2">%</Text>
              </View>
              <Text className="text-white text-lg font-semibold mt-2">
                {getPerformanceMessage(Number(percentage))}
              </Text>

              <View className="flex-row items-center justify-between w-full mt-6 pt-6 border-t border-white/20">
                <View className="items-center flex-1">
                  <Text className="text-white text-xs opacity-80 mb-1">
                    Total Marks
                  </Text>
                  <Text className="text-white text-2xl font-bold">{totalMarks}</Text>
                </View>
                <View className="w-px h-12 bg-white/20" />
                <View className="items-center flex-1">
                  <Text className="text-white text-xs opacity-80 mb-1">
                    Obtained
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {obtainedMarks}
                  </Text>
                </View>
                <View className="w-px h-12 bg-white/20" />
                <View className="items-center flex-1">
                  <Text className="text-white text-xs opacity-80 mb-1">Grade</Text>
                  <Text className="text-white text-2xl font-bold">
                    {result.grade || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Subject-wise Results */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Subject-wise Results
            </Text>
            {result.subjects?.map((subject: any) => (
              <ResultCard key={subject.subject} result={subject} />
            ))}
          </View>

          {/* Class Performance */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Class Performance
            </Text>
            <View className="space-y-3">
              <PerformanceRow
                label="Class Average"
                value={`${result.classStats?.average || 0}%`}
                icon="people"
                color="#3B82F6"
              />
              <PerformanceRow
                label="Class Highest"
                value={`${result.classStats?.highest || 0}%`}
                icon="trophy"
                color="#F59E0B"
              />
              <PerformanceRow
                label="Class Lowest"
                value={`${result.classStats?.lowest || 0}%`}
                icon="stats-chart"
                color="#EF4444"
              />
              <PerformanceRow
                label="Your Rank"
                value={`${result.rank || 'N/A'} / ${result.classStats?.totalStudents || 0}`}
                icon="medal"
                color="#8B5CF6"
              />
            </View>
          </View>

          {/* Remarks */}
          {result.remarks && (
            <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="chatbox-ellipses" size={20} color="#3B82F6" />
                <Text className="text-blue-900 font-semibold ml-2">
                  Teacher's Remarks
                </Text>
              </View>
              <Text className="text-blue-800 text-sm">{result.remarks}</Text>
            </View>
          )}

          {/* Strength & Weakness Analysis */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Performance Analysis
            </Text>

            {/* Strengths */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-green-700 font-semibold ml-2">Strengths</Text>
              </View>
              <View className="space-y-2">
                {result.subjects
                  ?.filter((s: any) => (s.obtainedMarks / s.totalMarks) * 100 >= 75)
                  .map((subject: any, index: number) => (
                    <View key={index} className="flex-row items-center ml-6">
                      <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      <Text className="text-sm text-gray-700">
                        {subject.subject} - {' '}
                        {((subject.obtainedMarks / subject.totalMarks) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
              </View>
            </View>

            {/* Areas for Improvement */}
            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                <Text className="text-yellow-700 font-semibold ml-2">
                  Areas for Improvement
                </Text>
              </View>
              <View className="space-y-2">
                {result.subjects
                  ?.filter((s: any) => (s.obtainedMarks / s.totalMarks) * 100 < 60)
                  .map((subject: any, index: number) => (
                    <View key={index} className="flex-row items-center ml-6">
                      <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" />
                      <Text className="text-sm text-gray-700">
                        {subject.subject} - {' '}
                        {((subject.obtainedMarks / subject.totalMarks) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 mb-4">
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-4">
              <View className="flex-row items-center justify-center">
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">Download PDF</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-4">
              <View className="flex-row items-center justify-center">
                <Ionicons name="print" size={20} color="#6B7280" />
                <Text className="text-gray-700 font-semibold ml-2">Print</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contact Teacher */}
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-8 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="chatbubble" size={20} color="#3B82F6" />
              </View>
              <Text className="text-base font-medium text-gray-900 ml-3">
                Discuss with Teacher
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function PerformanceRow({
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
