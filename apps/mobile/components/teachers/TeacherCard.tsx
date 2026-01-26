import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  subjectAssignments?: Array<{
    subject: {
      id: string;
      name: string;
      code: string;
    };
  }>;
  user?: {
    email: string;
    phone?: string;
    avatar?: string;
  };
  status?: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  onPress: () => void;
}

export default function TeacherCard({ teacher, onPress }: TeacherCardProps) {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const initials = `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`;
  const subjects = teacher.subjectAssignments?.map(sa => sa.subject) || [];

  const statusColor = teacher.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
          {teacher.user?.avatar ? (
            <Text className="text-xl">{teacher.user.avatar}</Text>
          ) : (
            <Text className="text-purple-600 font-semibold">{initials}</Text>
          )}
        </View>

        {/* Teacher Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{fullName}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="id-card-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{teacher.employeeId}</Text>
          </View>

          {/* Department */}
          {teacher.department && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="business-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{teacher.department.name}</Text>
            </View>
          )}

          {/* Subjects - Horizontal Scroll */}
          {subjects.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-2"
            >
              <View className="flex-row gap-2">
                {subjects.slice(0, 3).map((subject) => (
                  <View
                    key={subject.id}
                    className="bg-blue-50 px-2 py-1 rounded-full"
                  >
                    <Text className="text-xs text-blue-700 font-medium">
                      {subject.name}
                    </Text>
                  </View>
                ))}
                {subjects.length > 3 && (
                  <View className="bg-gray-100 px-2 py-1 rounded-full">
                    <Text className="text-xs text-gray-700 font-medium">
                      +{subjects.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Status Badge */}
        {teacher.status && (
          <View className="mr-2">
            <View className={`px-2 py-1 rounded-full ${statusColor}`}>
              <Text className="text-xs font-medium">{teacher.status}</Text>
            </View>
          </View>
        )}

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
