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
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import BuildingCard from '@/components/hostel/BuildingCard';

export default function HostelBuildingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hostel-buildings', searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;

      const response = await apiHelpers.getHostelBuildings(params);
      return response.data;
    },
  });

  const canManageHostel = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading buildings...</Text>
      </View>
    );
  }

  const buildings = data?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Hostel Buildings</Text>
        <Text className="text-white/80 mt-1">
          {buildings.length} {buildings.length === 1 ? 'building' : 'buildings'}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by building name..."
        />
      </View>

      {/* Buildings List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {buildings.length > 0 ? (
          buildings.map((building: any) => (
            <BuildingCard
              key={building.id}
              building={building}
              onPress={() => router.push(`/hostel/buildings/${building.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="business-outline"
            title="No Buildings Found"
            message={
              searchQuery
                ? `No buildings match "${searchQuery}"`
                : 'No hostel buildings have been added yet'
            }
            actionLabel={canManageHostel ? 'Add Building' : undefined}
            onAction={canManageHostel ? () => router.push('/hostel/buildings/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canManageHostel && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/hostel/buildings/add')}
        />
      )}
    </View>
  );
}
