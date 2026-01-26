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
import AllocationCard from '@/components/hostel/AllocationCard';

export default function HostelAllocationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');

  const { data: allocationsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hostel-allocations', searchQuery, buildingFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (buildingFilter !== 'all') params.buildingId = buildingFilter;

      const response = await apiHelpers.getHostelAllocations(params);
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
        <Text className="mt-4 text-gray-600">Loading allocations...</Text>
      </View>
    );
  }

  const allocations = allocationsData?.data || [];
  const buildings = buildingsData?.data || [];

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
        <Text className="text-white text-2xl font-bold">Hostel Allocations</Text>
        <Text className="text-white/80 mt-1">
          {allocations.length} {allocations.length === 1 ? 'allocation' : 'allocations'}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by student name..."
        />

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

      {/* Allocations List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {allocations.length > 0 ? (
          allocations.map((allocation: any) => (
            <AllocationCard key={allocation.id} allocation={allocation} />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Allocations Found"
            message={
              searchQuery
                ? `No allocations match "${searchQuery}"`
                : 'No hostel allocations have been made yet'
            }
            actionLabel={canManageHostel ? 'Add Allocation' : undefined}
            onAction={canManageHostel ? () => router.push('/hostel/allocations/manage') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canManageHostel && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/hostel/allocations/manage')}
        />
      )}
    </View>
  );
}
