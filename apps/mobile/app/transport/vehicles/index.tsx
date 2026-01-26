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
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import VehicleCard from '@/components/transport/VehicleCard';

export default function VehiclesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: vehicles, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['vehicles', searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;

      const response = await apiHelpers.getVehicles(params);
      return response.data;
    },
  });

  const canAddVehicle = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading vehicles...</Text>
      </View>
    );
  }

  const vehiclesList = vehicles?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Vehicles</Text>
        <Text className="text-white/80 mt-1">
          {vehiclesList.length} vehicle{vehiclesList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by vehicle number or driver name..."
        />
      </View>

      {/* Vehicles List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {vehiclesList.length > 0 ? (
          vehiclesList.map((vehicle: any) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPress={() => router.push(`/transport/vehicles/${vehicle.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="bus-outline"
            title="No Vehicles Found"
            message={
              searchQuery
                ? `No vehicles match "${searchQuery}"`
                : 'No vehicles have been added yet'
            }
            actionLabel={canAddVehicle ? 'Add Vehicle' : undefined}
            onAction={canAddVehicle ? () => router.push('/transport/vehicles/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canAddVehicle && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/transport/vehicles/add')}
        />
      )}
    </View>
  );
}
