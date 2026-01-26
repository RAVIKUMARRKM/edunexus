import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import AllocationCard from '@/components/transport/AllocationCard';

export default function AllocationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  const { data: allocations, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['transport-allocations', searchQuery, routeFilter, vehicleFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (routeFilter !== 'all') params.routeId = routeFilter;
      if (vehicleFilter !== 'all') params.vehicleId = vehicleFilter;

      const response = await apiHelpers.getTransportAllocations(params);
      return response.data;
    },
  });

  const { data: routes } = useQuery({
    queryKey: ['transport-routes'],
    queryFn: async () => {
      const response = await apiHelpers.getTransportRoutes();
      return response.data;
    },
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await apiHelpers.getVehicles();
      return response.data;
    },
  });

  const canManageAllocations = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  const routeOptions = [
    { label: 'All Routes', value: 'all' },
    ...(routes?.data?.map((r: any) => ({
      label: r.name,
      value: r.id,
    })) || []),
  ];

  const vehicleOptions = [
    { label: 'All Vehicles', value: 'all' },
    ...(vehicles?.data?.map((v: any) => ({
      label: v.vehicleNumber,
      value: v.id,
    })) || []),
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading allocations...</Text>
      </View>
    );
  }

  const allocationsList = allocations?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Transport Allocations</Text>
        <Text className="text-white/80 mt-1">
          {allocationsList.length} allocation{allocationsList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by student name..."
        />

        {routes && routes.data && routes.data.length > 0 && (
          <View className="mt-3">
            <Text className="text-xs font-medium text-gray-600 mb-2">Filter by Route</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FilterChips
                options={routeOptions}
                selected={routeFilter}
                onSelect={setRouteFilter}
              />
            </ScrollView>
          </View>
        )}

        {vehicles && vehicles.data && vehicles.data.length > 0 && (
          <View className="mt-3">
            <Text className="text-xs font-medium text-gray-600 mb-2">Filter by Vehicle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FilterChips
                options={vehicleOptions}
                selected={vehicleFilter}
                onSelect={setVehicleFilter}
              />
            </ScrollView>
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
        {allocationsList.length > 0 ? (
          allocationsList.map((allocation: any) => (
            <AllocationCard
              key={allocation.id}
              allocation={allocation}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Allocations Found"
            message={
              searchQuery
                ? `No allocations match "${searchQuery}"`
                : 'No transport allocations have been made yet'
            }
            actionLabel={canManageAllocations ? 'Add Allocation' : undefined}
            onAction={canManageAllocations ? () => router.push('/transport/allocations/manage') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canManageAllocations && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/transport/allocations/manage')}
        />
      )}
    </View>
  );
}
