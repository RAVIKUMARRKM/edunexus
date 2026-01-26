import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function RoomDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: room, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hostel-room', id],
    queryFn: async () => {
      const response = await apiHelpers.getHostelRoom(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  const canManageHostel = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading room details...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Room not found</Text>
      </View>
    );
  }

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
  const occupancyPercentage = (room.currentOccupancy / room.capacity) * 100;
  const allocations = room.allocations || [];
  const amenities = room.amenities ? (Array.isArray(room.amenities) ? room.amenities : JSON.parse(room.amenities)) : [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Room {room.roomNumber}</Text>
        <View className={`mt-2 px-3 py-1 rounded-full self-start ${getStatusColor(status)}`}>
          <Text className="text-sm font-medium">{status}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Room Details Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Room Details</Text>

          {/* Building */}
          {room.building && (
            <View className="flex-row mb-3">
              <Ionicons name="business-outline" size={20} color="#6B7280" />
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Building</Text>
                <Text className="text-base text-gray-900">{room.building.name}</Text>
              </View>
            </View>
          )}

          {/* Floor */}
          {room.floor !== undefined && (
            <View className="flex-row mb-3">
              <Ionicons name="layers-outline" size={20} color="#6B7280" />
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Floor</Text>
                <Text className="text-base text-gray-900">Floor {room.floor}</Text>
              </View>
            </View>
          )}

          {/* Capacity */}
          <View className="flex-row mb-3">
            <Ionicons name="people-outline" size={20} color="#6B7280" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-600 mb-1">Capacity</Text>
              <Text className="text-base text-gray-900">{room.capacity} beds</Text>
            </View>
          </View>

          {/* Current Occupancy */}
          <View className="flex-row mb-3">
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-600 mb-1">Current Occupancy</Text>
              <Text className="text-base text-gray-900">
                {room.currentOccupancy} / {room.capacity} beds occupied
              </Text>
              <View className="bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
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
          </View>
        </View>

        {/* Allocated Students */}
        {allocations.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Allocated Students ({allocations.length})
            </Text>

            {allocations.map((allocation: any) => (
              <View
                key={allocation.id}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Text className="text-blue-600 font-semibold">
                    {allocation.student?.firstName?.charAt(0) || 'S'}
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    {allocation.student?.firstName} {allocation.student?.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Bed {allocation.bedNumber} • Allocated on{' '}
                    {new Date(allocation.allocationDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <View className="bg-white mx-4 mt-4 mb-4 rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Amenities</Text>
            <View className="flex-row flex-wrap gap-2">
              {amenities.map((amenity: string, index: number) => (
                <View key={index} className="bg-blue-50 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                  <Text className="text-blue-700 ml-1">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Edit Button */}
      {canManageHostel && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            onPress={() => router.push(`/hostel/rooms/edit/${id}`)}
            className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <Ionicons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
