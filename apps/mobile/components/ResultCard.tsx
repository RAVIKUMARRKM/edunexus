import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SubjectResult {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks?: string;
}

interface ResultCardProps {
  result: SubjectResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const percentage = ((result.obtainedMarks / result.totalMarks) * 100).toFixed(1);

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-100';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-100';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-100';
    if (grade === 'D') return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'trophy';
    if (grade === 'B+' || grade === 'B') return 'star';
    if (grade === 'C+' || grade === 'C') return 'thumbs-up';
    return 'flag';
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {result.subject}
          </Text>
          {result.remarks && (
            <Text className="text-xs text-gray-500">{result.remarks}</Text>
          )}
        </View>
        <View className={`px-3 py-2 rounded-lg ${getGradeColor(result.grade)}`}>
          <View className="flex-row items-center">
            <Ionicons
              name={getPerformanceIcon(result.grade)}
              size={16}
              color={getGradeColor(result.grade).split(' ')[0].replace('text-', '')}
            />
            <Text className={`ml-1 text-lg font-bold ${getGradeColor(result.grade).split(' ')[0]}`}>
              {result.grade}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-baseline mb-1">
            <Text className="text-2xl font-bold text-gray-900">
              {result.obtainedMarks}
            </Text>
            <Text className="text-base text-gray-500 ml-1">
              / {result.totalMarks}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">Marks Obtained</Text>
        </View>

        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
            <Text className="text-lg font-bold text-white">{percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mt-3">
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${percentage}%` }}
          />
        </View>
      </View>
    </View>
  );
}
