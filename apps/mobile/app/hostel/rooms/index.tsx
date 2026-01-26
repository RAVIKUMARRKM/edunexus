import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import RoomCard from '@/components/hostel/RoomCard';

export default function HostelRoomsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');

  const { data: roomsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hostel-rooms', searchQuery, statusFilter, buildingFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (buildingFilter !== 'all') params.buildingId = buildingFilter;

      const response = await apiHelpers.getHostelRooms(params);
      return response.data;
    },
  });

  const { data: buildingsData } = useQuery({
    queryKey: ['hostel-buildings'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelBuildings();
      return response.data;
    },
  });

  const canManageHostel = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading rooms...</Text>
      </View>
    );
  }

  const rooms = roomsData?.data || [];
  const buildings = buildingsData?.data || [];

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Vacant', value: 'VACANT' },
    { label: 'Occupied', value: 'OCCUPIED' },
    { label: 'Full', value: 'FULL' },
  ];

  const buildingOptions = [
    { label: 'All Buildings', value: 'all' },
    ...buildings.map((b: any) => ({
      label: b.name,
      value: b.id,
    })),
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Hostel Rooms</Text>
        <Text className="text-white/80 mt-1">
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by room number..."
        />

        <View className="mt-3">
          <FilterChips
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </View>

        {buildings.length > 0 && (
          <View className="mt-3">
            <FilterChips
              options={buildingOptions}
              selected={buildingFilter}
              onSelect={setBuildingFilter}
            />
          </View>
        )}
      </View>

      {/* Rooms List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {rooms.length > 0 ? (
          rooms.map((room: any) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => router.push(`/hostel/rooms/${room.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="bed-outline"
            title="No Rooms Found"
            message={
              searchQuery
                ? `No rooms match "${searchQuery}"`
                : 'No hostel rooms have been added yet'
            }
            actionLabel={canManageHostel ? 'Add Room' : undefined}
            onAction={canManageHostel ? () => router.push('/hostel/rooms/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canManageHostel && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/hostel/rooms/add')}
        />
      )}
    </View>
  );
}
