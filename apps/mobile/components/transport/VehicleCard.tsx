import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: 'BUS' | 'VAN' | 'CAR';
  capacity: number;
  driverName: string;
  driverPhone?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

const vehicleIcons = {
  BUS: 'bus-outline',
  VAN: 'car-outline',
  CAR: 'car-sport-outline',
};

const vehicleColors = {
  BUS: { bg: 'bg-blue-100', color: '#3B82F6' },
  VAN: { bg: 'bg-green-100', color: '#10B981' },
  CAR: { bg: 'bg-purple-100', color: '#8B5CF6' },
};

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const iconName = vehicleIcons[vehicle.type] || 'bus-outline';
  const colors = vehicleColors[vehicle.type] || vehicleColors.BUS;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Vehicle Icon */}
        <View className={`w-12 h-12 ${colors.bg} rounded-full items-center justify-center`}>
          <Ionicons name={iconName as any} size={24} color={colors.color} />
        </View>

        {/* Vehicle Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{vehicle.vehicleNumber}</Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-gray-100 px-2 py-0.5 rounded">
              <Text className="text-xs font-medium text-gray-700">{vehicle.type}</Text>
            </View>
            <View className="flex-row items-center ml-2">
              <Ionicons name="people-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{vehicle.capacity} seats</Text>
            </View>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{vehicle.driverName}</Text>
          </View>
          {vehicle.driverPhone && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{vehicle.driverPhone}</Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
