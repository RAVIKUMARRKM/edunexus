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
import RouteCard from '@/components/transport/RouteCard';

export default function RoutesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: routes, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['transport-routes', searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;

      const response = await apiHelpers.getTransportRoutes(params);
      return response.data;
    },
  });

  const canAddRoute = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading routes...</Text>
      </View>
    );
  }

  const routesList = routes?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Transport Routes</Text>
        <Text className="text-white/80 mt-1">
          {routesList.length} route{routesList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search routes by name..."
        />
      </View>

      {/* Routes List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {routesList.length > 0 ? (
          routesList.map((route: any) => (
            <RouteCard
              key={route.id}
              route={route}
              onPress={() => router.push(`/transport/routes/${route.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="map-outline"
            title="No Routes Found"
            message={
              searchQuery
                ? `No routes match "${searchQuery}"`
                : 'No routes have been added yet'
            }
            actionLabel={canAddRoute ? 'Add Route' : undefined}
            onAction={canAddRoute ? () => router.push('/transport/routes/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canAddRoute && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/transport/routes/add')}
        />
      )}
    </View>
  );
}
