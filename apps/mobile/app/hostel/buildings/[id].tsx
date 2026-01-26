import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import RoomCard from '@/components/hostel/RoomCard';

export default function BuildingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: building, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hostel-building', id],
    queryFn: async () => {
      const response = await apiHelpers.getHostelBuilding(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: roomsData } = useQuery({
    queryKey: ['hostel-rooms', id],
    queryFn: async () => {
      const response = await apiHelpers.getHostelRooms({ buildingId: id as string });
      return response.data;
    },
    enabled: !!id,
  });

  const canManageHostel = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading building details...</Text>
      </View>
    );
  }

  if (!building) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Building not found</Text>
      </View>
    );
  }

  const rooms = roomsData?.data || [];
  const occupiedRooms = rooms.filter((r: any) => r.currentOccupancy > 0).length;
  const totalCapacity = rooms.reduce((sum: number, r: any) => sum + r.capacity, 0);
  const currentOccupancy = rooms.reduce((sum: number, r: any) => sum + r.currentOccupancy, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BOYS':
        return 'bg-blue-100 text-blue-800';
      case 'GIRLS':
        return 'bg-pink-100 text-pink-800';
      case 'CO_ED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'BOYS':
        return 'Boys';
      case 'GIRLS':
        return 'Girls';
      case 'CO_ED':
        return 'Co-Ed';
      default:
        return type;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{building.name}</Text>
        <View className={`mt-2 px-3 py-1 rounded-full self-start ${getTypeColor(building.type)}`}>
          <Text className="text-sm font-medium">{getTypeLabel(building.type)}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Building Details Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Building Details</Text>

          {/* Address */}
          {building.address && (
            <View className="flex-row mb-3">
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <View className="flex-1 ml-2">
                <Text className="text-sm text-gray-600 mb-1">Address</Text>
                <Text className="text-base text-gray-900">{building.address}</Text>
              </View>
            </View>
          )}

          {/* Total Rooms */}
          <View className="flex-row mb-3">
            <Ionicons name="bed-outline" size={20} color="#6B7280" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-600 mb-1">Total Rooms</Text>
              <Text className="text-base text-gray-900">{building.totalRooms}</Text>
            </View>
          </View>

          {/* Occupancy */}
          <View className="flex-row mb-3">
            <Ionicons name="people-outline" size={20} color="#6B7280" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-600 mb-1">Occupancy</Text>
              <Text className="text-base text-gray-900">
                {currentOccupancy} / {totalCapacity} beds
              </Text>
              <View className="bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                <View
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${totalCapacity > 0 ? (currentOccupancy / totalCapacity) * 100 : 0}%`,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Warden Details Card */}
        {(building.wardenName || building.wardenPhone || building.wardenEmail) && (
          <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Warden Details</Text>

            {building.wardenName && (
              <View className="flex-row mb-3">
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm text-gray-600 mb-1">Name</Text>
                  <Text className="text-base text-gray-900">{building.wardenName}</Text>
                </View>
              </View>
            )}

            {building.wardenPhone && (
              <View className="flex-row mb-3">
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm text-gray-600 mb-1">Phone</Text>
                  <Text className="text-base text-gray-900">{building.wardenPhone}</Text>
                </View>
              </View>
            )}

            {building.wardenEmail && (
              <View className="flex-row mb-3">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <View className="flex-1 ml-2">
                  <Text className="text-sm text-gray-600 mb-1">Email</Text>
                  <Text className="text-base text-gray-900">{building.wardenEmail}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Rooms in Building */}
        <View className="mx-4 mt-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Rooms ({rooms.length})
            </Text>
          </View>

          {rooms.length > 0 ? (
            rooms.map((room: any) => (
              <RoomCard
                key={room.id}
                room={room}
                onPress={() => router.push(`/hostel/rooms/${room.id}`)}
              />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="bed-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-600 mt-3">No rooms in this building</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Button */}
      {canManageHostel && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            onPress={() => router.push(`/hostel/buildings/edit/${id}`)}
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
