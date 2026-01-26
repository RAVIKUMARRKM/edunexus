import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';

export default function HostelHomeScreen() {
  const router = useRouter();

  const { data: buildingsData, isLoading: loadingBuildings } = useQuery({
    queryKey: ['hostel-buildings-count'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelBuildings();
      return response.data;
    },
  });

  const { data: roomsData, isLoading: loadingRooms } = useQuery({
    queryKey: ['hostel-rooms-count'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelRooms();
      return response.data;
    },
  });

  const { data: allocationsData, isLoading: loadingAllocations } = useQuery({
    queryKey: ['hostel-allocations-count'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelAllocations();
      return response.data;
    },
  });

  const buildings = buildingsData?.data || [];
  const rooms = roomsData?.data || [];
  const allocations = allocationsData?.data || [];

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r: any) => r.currentOccupancy > 0).length;
  const availableRooms = rooms.filter((r: any) => r.currentOccupancy < r.capacity).length;

  const isLoading = loadingBuildings || loadingRooms || loadingAllocations;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading hostel data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Hostel Management</Text>
        <Text className="text-white/80 mt-1">
          Manage buildings, rooms, and allocations
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Buildings Card */}
        <TouchableOpacity
          onPress={() => router.push('/hostel/buildings')}
          className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="business" size={24} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">Buildings</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {buildings.length} {buildings.length === 1 ? 'building' : 'buildings'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-blue-500 px-4 py-2 rounded-lg mr-2">
                <Text className="text-white font-bold text-xl">{buildings.length}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Rooms Card */}
        <TouchableOpacity
          onPress={() => router.push('/hostel/rooms')}
          className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="bed" size={24} color="#10B981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">Rooms</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {totalRooms} total {totalRooms === 1 ? 'room' : 'rooms'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </View>

          {/* Room Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-gray-50 rounded-lg p-3">
              <Text className="text-xs text-gray-600 mb-1">Total</Text>
              <Text className="text-2xl font-bold text-gray-900">{totalRooms}</Text>
            </View>
            <View className="flex-1 bg-yellow-50 rounded-lg p-3">
              <Text className="text-xs text-yellow-800 mb-1">Occupied</Text>
              <Text className="text-2xl font-bold text-yellow-600">{occupiedRooms}</Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-lg p-3">
              <Text className="text-xs text-green-800 mb-1">Available</Text>
              <Text className="text-2xl font-bold text-green-600">{availableRooms}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Allocations Card */}
        <TouchableOpacity
          onPress={() => router.push('/hostel/allocations')}
          className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name="people" size={24} color="#8B5CF6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-900">Allocations</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {allocations.length} {allocations.length === 1 ? 'student' : 'students'} allocated
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-purple-500 px-4 py-2 rounded-lg mr-2">
                <Text className="text-white font-bold text-xl">{allocations.length}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5">
          <Text className="text-white text-lg font-semibold mb-4">Quick Stats</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/80 text-xs mb-1">Occupancy Rate</Text>
              <Text className="text-white text-2xl font-bold">
                {totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%
              </Text>
            </View>
            <View>
              <Text className="text-white/80 text-xs mb-1">Total Capacity</Text>
              <Text className="text-white text-2xl font-bold">
                {rooms.reduce((sum: number, r: any) => sum + r.capacity, 0)}
              </Text>
            </View>
            <View>
              <Text className="text-white/80 text-xs mb-1">Currently Housed</Text>
              <Text className="text-white text-2xl font-bold">{allocations.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
