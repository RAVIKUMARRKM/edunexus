import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';

export default function TransportHomeScreen() {
  const router = useRouter();

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await apiHelpers.getVehicles();
      return response.data;
    },
  });

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['transport-routes'],
    queryFn: async () => {
      const response = await apiHelpers.getTransportRoutes();
      return response.data;
    },
  });

  const { data: allocations, isLoading: allocationsLoading } = useQuery({
    queryKey: ['transport-allocations'],
    queryFn: async () => {
      const response = await apiHelpers.getTransportAllocations();
      return response.data;
    },
  });

  const vehicleCount = vehicles?.data?.length || 0;
  const routeCount = routes?.data?.length || 0;
  const allocationCount = allocations?.data?.length || 0;

  const isLoading = vehiclesLoading || routesLoading || allocationsLoading;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 pt-12 pb-8">
        <Text className="text-white text-2xl font-bold">Transport Management</Text>
        <Text className="text-white/80 mt-1">Manage vehicles, routes, and allocations</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-600">Loading transport data...</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Vehicles Card */}
            <TouchableOpacity
              onPress={() => router.push('/transport/vehicles')}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                      <Ionicons name="bus-outline" size={24} color="#3B82F6" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 ml-3">Vehicles</Text>
                  </View>
                  <Text className="text-3xl font-bold text-blue-500 ml-15">{vehicleCount}</Text>
                  <Text className="text-sm text-gray-600 ml-15">Total vehicles</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {/* Routes Card */}
            <TouchableOpacity
              onPress={() => router.push('/transport/routes')}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="map-outline" size={24} color="#10B981" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 ml-3">Routes</Text>
                  </View>
                  <Text className="text-3xl font-bold text-green-500 ml-15">{routeCount}</Text>
                  <Text className="text-sm text-gray-600 ml-15">Active routes</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {/* Allocations Card */}
            <TouchableOpacity
              onPress={() => router.push('/transport/allocations')}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                      <Ionicons name="people-outline" size={24} color="#8B5CF6" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 ml-3">Allocations</Text>
                  </View>
                  <Text className="text-3xl font-bold text-purple-500 ml-15">{allocationCount}</Text>
                  <Text className="text-sm text-gray-600 ml-15">Student allocations</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {/* Quick Stats */}
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</Text>
              <View className="space-y-3">
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                    <Text className="text-sm text-gray-600 ml-2">Active Vehicles</Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">{vehicleCount}</Text>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={20} color="#3B82F6" />
                    <Text className="text-sm text-gray-600 ml-2">Routes</Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">{routeCount}</Text>
                </View>
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={20} color="#8B5CF6" />
                    <Text className="text-sm text-gray-600 ml-2">Students Using Transport</Text>
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">{allocationCount}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
