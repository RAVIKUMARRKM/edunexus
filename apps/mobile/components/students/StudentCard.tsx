import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  class?: { name: string };
  section?: { name: string };
  user?: { avatar?: string };
  status?: string;
}

interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  const classInfo = student.class && student.section
    ? `${student.class.name} ${student.section.name}`
    : 'N/A';

  const statusColor = student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
          {student.user?.avatar ? (
            <Text className="text-xl">{student.user.avatar}</Text>
          ) : (
            <Text className="text-blue-600 font-semibold">{initials}</Text>
          )}
        </View>

        {/* Student Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{fullName}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="id-card-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{student.admissionNo}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="school-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{classInfo}</Text>
          </View>
        </View>

        {/* Status Badge */}
        {student.status && (
          <View className={`px-2 py-1 rounded-full ${statusColor}`}>
            <Text className="text-xs font-medium">{student.status}</Text>
          </View>
        )}

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-2" />
      </View>
    </TouchableOpacity>
  );
}
