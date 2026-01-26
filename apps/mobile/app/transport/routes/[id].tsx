import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function RouteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: route, isLoading } = useQuery({
    queryKey: ['transport-route', id],
    queryFn: async () => {
      const response = await apiHelpers.getTransportRoute(id as string);
      return response.data;
    },
  });

  const canEdit = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!route) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Route not found</Text>
      </View>
    );
  }

  const stops = route.stops || [];
  const allocations = route.allocations || [];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Route Header */}
        <View className="items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <Ionicons name="map-outline" size={40} color="#10B981" />
          </View>
          <Text className="text-white text-2xl font-bold">{route.name}</Text>
          {route.distance && (
            <Text className="text-white/80 mt-1">{route.distance} km</Text>
          )}
        </View>
      </View>

      {/* Info Sections */}
      <View className="px-4 py-4">
        {/* Route Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Route Information</Text>

          <InfoRow icon="map-outline" label="Route Name" value={route.name} />
          {route.distance && (
            <InfoRow icon="speedometer-outline" label="Distance" value={`${route.distance} km`} />
          )}
          <InfoRow icon="location-outline" label="Total Stops" value={`${stops.length} stops`} />
        </View>

        {/* Stops */}
        {stops.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Stops & Timings</Text>
            {stops.map((stop: any, index: number) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index !== stops.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Text className="text-green-600 font-semibold">{index + 1}</Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">{stop.name}</Text>
                  {stop.time && (
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-1">{stop.time}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Allocated Vehicle */}
        {route.vehicle && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Allocated Vehicle</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="bus-outline" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900">
                  {route.vehicle.vehicleNumber}
                </Text>
                <Text className="text-sm text-gray-600">{route.vehicle.type}</Text>
                {route.vehicle.driverName && (
                  <Text className="text-sm text-gray-600 mt-1">
                    Driver: {route.vehicle.driverName}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Students Using This Route */}
        {allocations.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Students Using This Route ({allocations.length})
            </Text>
            {allocations.map((allocation: any, index: number) => (
              <View
                key={allocation.id}
                className={`flex-row items-center py-3 ${
                  index !== allocations.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    {allocation.student.firstName} {allocation.student.lastName}
                  </Text>
                  {allocation.pickupPoint && (
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-1">{allocation.pickupPoint}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        {canEdit && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push(`/transport/routes/edit/${id}`)}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Edit Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="flex-row items-start py-2 border-b border-gray-100 last:border-b-0">
      <View className="w-8">
        <Ionicons name={icon as any} size={18} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-600">{label}</Text>
        <Text className="text-base text-gray-900 mt-1">{value}</Text>
      </View>
    </View>
  );
}
