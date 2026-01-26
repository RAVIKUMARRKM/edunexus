import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Room {
  id: string;
  roomNumber: string;
  building?: {
    name: string;
  };
  capacity: number;
  currentOccupancy: number;
  floor?: number;
}

interface RoomCardProps {
  room: Room;
  onPress: () => void;
}

export default function RoomCard({ room, onPress }: RoomCardProps) {
  const getOccupancyStatus = () => {
    if (room.currentOccupancy === 0) return 'VACANT';
    if (room.currentOccupancy < room.capacity) return 'OCCUPIED';
    return 'FULL';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VACANT':
        return 'bg-green-100 text-green-800';
      case 'OCCUPIED':
        return 'bg-yellow-100 text-yellow-800';
      case 'FULL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const status = getOccupancyStatus();
  const statusColor = getStatusColor(status);
  const occupancyPercentage = (room.currentOccupancy / room.capacity) * 100;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Room Icon with Status Color */}
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            status === 'VACANT'
              ? 'bg-green-100'
              : status === 'OCCUPIED'
              ? 'bg-yellow-100'
              : 'bg-red-100'
          }`}
        >
          <Ionicons
            name="bed"
            size={24}
            color={
              status === 'VACANT'
                ? '#10B981'
                : status === 'OCCUPIED'
                ? '#F59E0B'
                : '#EF4444'
            }
          />
        </View>

        {/* Room Info */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-900">
              Room {room.roomNumber}
            </Text>
            {room.floor !== undefined && (
              <Text className="text-sm text-gray-500 ml-2">Floor {room.floor}</Text>
            )}
          </View>

          {room.building && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="business-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{room.building.name}</Text>
            </View>
          )}

          <View className="flex-row items-center mt-1">
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {room.currentOccupancy} / {room.capacity} beds
            </Text>
          </View>

          {/* Occupancy Bar */}
          <View className="bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <View
              className={`h-full ${
                status === 'VACANT'
                  ? 'bg-green-500'
                  : status === 'OCCUPIED'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </View>
        </View>

        {/* Status Badge */}
        <View className="ml-2">
          <View className={`px-2 py-1 rounded-full ${statusColor}`}>
            <Text className="text-xs font-medium">{status}</Text>
          </View>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-2" />
      </View>
    </TouchableOpacity>
  );
}
