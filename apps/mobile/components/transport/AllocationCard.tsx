import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Allocation {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  route: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    vehicleNumber: string;
  };
  pickupPoint?: string;
}

interface AllocationCardProps {
  allocation: Allocation;
  onPress?: () => void;
}

export default function AllocationCard({ allocation, onPress }: AllocationCardProps) {
  const studentName = `${allocation.student.firstName} ${allocation.student.lastName}`;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      {...(onPress ? { onPress } : {})}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Student Icon */}
        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
          <Ionicons name="person-outline" size={24} color="#8B5CF6" />
        </View>

        {/* Allocation Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{studentName}</Text>

          <View className="flex-row items-center mt-1">
            <Ionicons name="map-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{allocation.route.name}</Text>
          </View>

          <View className="flex-row items-center mt-1">
            <Ionicons name="bus-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{allocation.vehicle.vehicleNumber}</Text>
          </View>

          {allocation.pickupPoint && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{allocation.pickupPoint}</Text>
            </View>
          )}
        </View>

        {/* Arrow (only if clickable) */}
        {onPress && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
      </View>
    </CardWrapper>
  );
}
