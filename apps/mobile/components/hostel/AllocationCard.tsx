import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Allocation {
  id: string;
  student?: {
    firstName: string;
    lastName: string;
    admissionNo?: string;
  };
  room?: {
    roomNumber: string;
    building?: {
      name: string;
    };
  };
  bedNumber: number;
  allocationDate: string;
}

interface AllocationCardProps {
  allocation: Allocation;
}

export default function AllocationCard({ allocation }: AllocationCardProps) {
  const studentName = allocation.student
    ? `${allocation.student.firstName} ${allocation.student.lastName}`
    : 'Unknown Student';

  const buildingName = allocation.room?.building?.name || 'N/A';
  const roomNumber = allocation.room?.roomNumber || 'N/A';
  const allocationDate = new Date(allocation.allocationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-start">
        {/* Student Avatar */}
        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
          <Text className="text-purple-600 font-semibold text-lg">
            {allocation.student?.firstName?.charAt(0) || 'S'}
          </Text>
        </View>

        {/* Allocation Info */}
        <View className="flex-1 ml-3">
          {/* Student Name */}
          <Text className="text-base font-semibold text-gray-900">{studentName}</Text>

          {/* Admission Number */}
          {allocation.student?.admissionNo && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="id-card-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {allocation.student.admissionNo}
              </Text>
            </View>
          )}

          {/* Building & Room */}
          <View className="flex-row items-center mt-1">
            <Ionicons name="business-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{buildingName}</Text>
            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
            <Ionicons name="bed-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              Room {roomNumber}, Bed {allocation.bedNumber}
            </Text>
          </View>

          {/* Allocation Date */}
          <View className="flex-row items-center mt-1">
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">Allocated on {allocationDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
